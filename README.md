# Canton Capital Exchange (CCX)

Privacy-preserving invoice factoring marketplace on the Canton Network. A
Supplier tokenizes a receivable, the Buyer countersigns it, multiple Lenders
bid blind on financing it, the Supplier accepts one bid and the cash
movement + receivable assignment settle atomically, and a regulator-style
Auditor sees only the finalized, funded result.

**Settlement uses real Canton-native tokens.** The contracts implement the
Splice token standard, so any Splice-compliant asset works as the funding
currency. Different lenders can bid in different tokens in the same auction;
the Supplier picks the quote with the token they prefer. On **localnet/sandbox**,
AlphaBank is auto-seeded with simulated **cETH** and BetaVentures with
simulated **cBTC** so the full multi-token demo runs without a wallet or
faucet. On **DevNet**, lenders use real holdings from the Canton Network faucet.

See `daml/main/daml/Invoicing.daml` for the contract architecture and the
comments on `PaymentObligation_Settle` / `Quote_Accept` for how the four
privacy invariants (mutual verification, blind auction, atomic settlement,
selective audit) are enforced structurally by Canton's stakeholder model rather
than by anything in the UI.

## Architecture: a generic blind-auction primitive, invoice factoring as the instance

The Daml model is split into two modules (`daml/main/daml/`):

- **`Cash.daml`** -- sandbox mock implementations of the Splice token
  interfaces (`Holding` and `TransferFactory`). On **DevNet** the settlement
  leg uses real Canton-native tokens (cETH, cBTC, raUSD) whose contracts
  already implement those interfaces from their own registries; this module
  only exists so the same `Invoicing.daml` code path works in local dev and
  the test suite without a live token registry. Zero invoice vocabulary in it.
- **`Invoicing.daml`** -- the invoice-factoring domain logic, including the
  blind auction itself (`FinancingInvitation`/`Quote`). Its module header
  spells out the underlying pattern explicitly: a sealed-bid auction is just
  one Invitation contract fanned out per invitee (`signatory` the listing
  owner(s), `observer` exactly one invitee) and one private Bid contract per
  invitee (`signatory` the invitee, `observer` the listing owner). No
  invitee is ever a stakeholder of another invitee's Invitation or Bid, so
  the blindness is enforced by Canton's stakeholder model itself, not by
  anything in this codebase.

**Token-per-quote model:** each `Quote` carries the specific Splice token
the Lender is offering (cETH, cBTC, or raUSD -- whatever they hold). The
Supplier sees the token denomination on each incoming quote and picks the
one they want to accept. Settlement transfers exactly that token atomically.
On sandbox both Lenders are pre-seeded with cETH so the demo runs end-to-end
without a wallet; on DevNet they use real holdings from the faucet.

That shape is reusable for any blind-bid marketplace on Canton -- sealed-bid
OTC quotes, M&A bid processes, reinsurance placement, supplier RFQs, other
RWA auctions -- by writing a new Invitation/Bid pair with that asset's own
fields and using the same Splice `Holding`/`TransferFactory` interfaces for
the payment leg. What's specific to invoice factoring and wouldn't carry
over automatically: the field names on the Invitation/Bid (`advanceRate`/
`yieldBps` are this domain's terms), and the nested-authority settlement step
(`PaymentObligation_Settle`) -- that part exists because a third party (the
Buyer) needs to consent to reassigning who gets paid; a plain two-sided
auction wouldn't need it at all.

## Quick start (Docker)

This is the fastest way to run the whole thing -- no `dpm`/Java/Node install
needed on the host, just Docker.

```bash
docker compose up -d --build
```

Then open **<http://localhost:8080>**.

That's it. There are no manual setup steps after this: the frontend
allocates the five demo parties (Alice/Bob/AlphaBank/BetaVentures/RegNode)
and seeds AlphaBank with 5 M simulated **cETH** and BetaVentures with
3 M simulated **cBTC** the first time it loads against a fresh ledger (see
"Self-healing party resolution" below). This works identically on a freshly
built container as it does on a host machine that's never seen `dpm`.

A few things worth knowing about the compose setup (see
`docker-compose.yml`, `daml/Dockerfile`, `frontend/Dockerfile`):

- **Two services:** `canton` (multi-stage build: compiles the Daml Archive
  with `dpm build`, then runs `dpm sandbox --json-api-port 7575` against
  it) and `frontend` (multi-stage build: `npm run build`, served by nginx).
- **Why `frontend` uses `network_mode: "service:canton"`:** Canton's
  sandbox binds the JSON Ledger API to `127.0.0.1` only, by design --
  the docs are explicit that it should never be reachable except locally.
  That means it isn't reachable from a sibling container over the normal
  Docker bridge network. Sharing `canton`'s network namespace makes
  `frontend`'s nginx see the same loopback the JSON API is bound to, so its
  proxy target is just `127.0.0.1:7575`. Because of this, both services'
  published ports (`7575` and `8080`) are declared on the `canton` service
  in compose -- a container using `network_mode: service:X` has no network
  stack of its own to publish ports from.
- `docker compose logs -f canton` / `... -f frontend` to watch either side
  while clicking through the UI.
- `docker compose down -v` to fully reset (fresh ledger, fresh parties, on
  next `up`).

## Quick start (local dev, with hot reload)

Useful when actively editing the frontend.

### Prerequisites

- Java, Node.js
- `dpm` (Digital Asset Package Manager):

  ```bash
  curl -sSL https://get.digitalasset.com/install/install.sh | sh
  export PATH="$HOME/.dpm/bin:$PATH"
  ```

### Run it

```bash
export PATH="$HOME/.dpm/bin:$PATH"

# 1. Build the Daml contracts
cd daml/main && dpm build && cd ../..

# 2. (optional) Re-run the privacy-invariant test suite
cd daml/test && dpm build && dpm test && cd ../..

# 3. Start the Canton sandbox with the JSON Ledger API on :7575
dpm sandbox --json-api-port 7575 \
  --dar daml/main/.daml/dist/daml-main-0.0.1.dar &

# 4. Run the frontend
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The Vite dev server proxies `/v2/*` to the
sandbox (see `vite.config.ts`) so there's no CORS configuration needed.

## Self-healing party resolution

Party IDs are **not** hardcoded anywhere in the frontend. On boot,
`frontend/src/ledger/bootstrap.ts` lists known parties via
`GET /v2/parties`, allocates any of the five demo parties that don't exist
yet (Alice/Bob/AlphaBank/BetaVentures/RegNode), and in **sandbox mode**
seeds each Lender with a `CashHolding` and a `CcxTransferFactory` if they
don't have one yet. This matters because Canton mints a fresh participant
key -- and therefore a fresh party-ID fingerprint suffix -- on every fresh
ledger boot (every `dpm sandbox` restart locally, or every fresh container
in Docker). A hardcoded party ID would silently go stale on any restart;
this doesn't.

**DevNet mode** (`VITE_REAL_TOKENS=true`): seeding is skipped. Lenders
receive cETH, cBTC, or raUSD from the Canton Network faucet via their
wallet, and those real token holdings and registry TransferFactory contracts
are passed directly to the quote submission choice. Create a `.env.local`
file in `frontend/` to enable it:

```dotenv
VITE_REAL_TOKENS=true
```

## Regenerating the TypeScript bindings after a contract change

```bash
export PATH="$HOME/.dpm/bin:$PATH"
cd daml/main && dpm build && cd ../..
dpm codegen-js daml/main/.daml/dist/daml-main-0.0.1.dar \
  -o frontend/src/generated/daml.js -s daml.js
cd frontend && npm run generate:api   # regenerates the JSON Ledger API client types
```

## Why this proves the privacy model is real

`fetchPersonaView` in `frontend/src/ledger/client.ts` does no client-side
filtering at all -- switching personas in the UI just changes which party
the next ledger query is submitted as. You can verify this independently of
the UI with raw `curl` (against the Docker setup, port 7575 is published on
the host too; against local dev it's the same port):

```bash
# Lender B's view never contains Lender A's invitation or quote, even with
# the exact contract id in hand -- it isn't a stakeholder, full stop.
curl localhost:7575/v2/state/ledger-end
curl -X POST localhost:7575/v2/state/active-contracts -d '{
  "activeAtOffset": <offset>,
  "eventFormat": {"filtersByParty": {"<BetaVentures partyId>": {"cumulative": [{"identifierFilter": {"WildcardFilter": {"value": {}}}}]}}, "verbose": false}
}'
```
