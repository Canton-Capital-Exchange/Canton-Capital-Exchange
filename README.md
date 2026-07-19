# Canton Capital Exchange (CCX)

A privacy-preserving invoice financing marketplace built on the Canton Network, developed as a hackathon submission and deployed live on a Canton DevNet validator node.

A **Supplier** tokenizes a receivable, the **Buyer** countersigns it, multiple **Lenders** bid blind on financing it, the Supplier accepts the best quote, and the cash transfer + receivable assignment settle atomically in a single Canton transaction. A **Regulator/Auditor** node sees only the finalized, funded result — never the competing bids.

**Live deployment:** [cantoncapitalexchange.netlify.app](https://cantoncapitalexchange.netlify.app)

---

## Why this is interesting

The core insight is that a sealed-bid auction is structurally expressible in Canton's stakeholder model with no application-layer enforcement:

- One `FinancingInvitation` contract per Lender — `signatory: supplier`, `observer: lender` — means no Lender is ever a stakeholder of another Lender's invitation.
- One `Quote` contract per Lender — `signatory: lender`, `observer: supplier` — keeps competing bids invisible to each other.
- The Auditor is added as `observer` only on `FundedInvoice`, the finalized result.

Canton's privacy model enforces all four invariants **at the ledger level**, not in the UI or application code. The frontend does zero client-side filtering — switching personas just changes which party ID the next ledger query is submitted as.

This shape generalises to any blind-bid marketplace: sealed OTC quotes, M&A bid processes, reinsurance placement, supplier RFQs, other RWA auctions.

---

## Architecture

### Daml contracts (`daml/main/daml/`)

**`Cash.daml`** — sandbox mock implementations of the Splice token standard interfaces (`Holding` and `TransferFactory`). On sandbox, lenders are auto-seeded with simulated cETH/cBTC so the full demo runs without a wallet. On DevNet, these interfaces are implemented by real Canton-native tokens from the network; this module only exists so the same `Invoicing.daml` settlement path works identically in local dev and test.

**`Invoicing.daml`** — the invoice-financing domain logic, including the blind auction (`FinancingInvitation` / `Quote`), the buyer payment obligation, and atomic settlement via `Quote_Accept`. Settlement calls `TransferFactory_Transfer` from the Splice token standard, making it agnostic to which token is being transferred.

**Four privacy invariants** (enforced structurally, not by the app):

1. **Mutual verification** — Buyer must countersign before the invoice is visible to Lenders
2. **Blind auction** — Lenders cannot see each other's invitations or quotes
3. **Atomic settlement** — cash transfer and funded invoice creation happen in one transaction
4. **Selective audit** — Auditor sees funded results only, never the bidding process

### Frontend (`frontend/`)

React + TypeScript, built with Vite, deployed on Netlify. Communicates with the Canton JSON Ledger API v2 via a Netlify proxy (no CORS).

**Auth modes** — controlled by `VITE_AUTH_MODE` at build time:

| Mode | Behaviour |
| --- | --- |
| unset (sandbox) | No auth; five demo parties allocated + seeded on first load |
| `keycloak` | Per-user OAuth2 with PKCE; each user gets their own Canton party |
| `client_credentials` | Machine token fetched server-side via Netlify Function; secret never in the JS bundle |

**Self-healing party resolution** — party IDs are never hardcoded. On boot, `bootstrap.ts` resolves or allocates five parties (Alice/Bob/AlphaBank/BetaVentures/RegNode), grants ledger rights for each on DevNet, and seeds demo holdings on first load. Canton mints a fresh party-ID suffix on every participant key rotation; this makes the app work correctly after any sandbox restart or fresh DevNet party allocation.

**Transaction transparency** — every successful on-chain action broadcasts a Canton `updateId` to a lightweight in-app toast with a direct link to the Canton block explorer.

---

## Quick start (Docker — recommended)

No host install needed beyond Docker.

```bash
docker compose up -d --build
```

Open **<http://localhost:8080>**.

The frontend allocates the five demo parties and seeds AlphaBank with 5 M simulated cETH and BetaVentures with 3 M simulated cBTC on first load. No manual setup steps.

```bash
docker compose logs -f canton     # Canton sandbox + JSON API logs
docker compose logs -f frontend   # nginx logs
docker compose down -v            # full reset — fresh ledger on next up
```

## Quick start (local dev, with hot reload)

### Prerequisites

- Java, Node.js ≥ 20
- `dpm` (Digital Asset Package Manager):

  ```bash
  curl -sSL https://get.digitalasset.com/install/install.sh | sh
  export PATH="$HOME/.dpm/bin:$PATH"
  ```

### Run

```bash
# 1. Build the Daml contracts
cd daml/main && dpm build && cd ../..

# 2. (optional) Run the privacy-invariant test suite
cd daml/test && dpm build && dpm test && cd ../..

# 3. Start Canton sandbox with the JSON Ledger API on :7575
dpm sandbox --json-api-port 7575 \
  --dar daml/main/.daml/dist/daml-main-0.0.1.dar &

# 4. Start the frontend
cd frontend && npm install && npm run dev
```

Open **<http://localhost:5173>**. The Vite dev server proxies `/v2/*` to the sandbox; no CORS configuration needed.

---

## DevNet deployment

The live deployment runs against a Canton DevNet validator node with two auth configurations:

- **client_credentials** — a machine token is fetched server-side by a Netlify Function (`netlify/functions/m2m-token.js`). The client secret is never in the JS bundle.
- **keycloak** — per-user OAuth2 Authorization Code + PKCE flow for deployments where judges/users log in with their own Canton identity.

Both modes use the same Daml contracts; the only difference is which party IDs are resolved and which auth tokens are issued.

DevNet env vars (set in Netlify UI, not committed to the repo):

```dotenv
VITE_REAL_TOKENS=true
VITE_AUTH_MODE=client_credentials   # or: keycloak
LEDGER_URL=<validator ledger API>
VITE_DEVNET_PARTY=<machine party id>
AUTH_TOKEN_URL=<token endpoint>
AUTH_CLIENT_ID=<client id>
AUTH_CLIENT_SECRET=<secret>         # server-side only, no VITE_ prefix
```

---

## Verifying the privacy model independently

`fetchPersonaView` in `frontend/src/ledger/client.ts` applies zero client-side filtering. You can verify the privacy guarantees directly against the Canton JSON API:

```bash
# Lender B's view never contains Lender A's invitation or quote.
# Not a matter of UI filtering — BetaVentures is simply not a stakeholder.
curl localhost:7575/v2/state/ledger-end

curl -X POST localhost:7575/v2/state/active-contracts -H 'Content-Type: application/json' -d '{
  "activeAtOffset": <offset>,
  "eventFormat": {
    "filtersByParty": {
      "<BetaVentures partyId>": {
        "cumulative": [{"identifierFilter": {"WildcardFilter": {"value": {}}}}]
      }
    },
    "verbose": false
  }
}'
```

Lender B's response will never include contracts for which only Lender A is a stakeholder — this is enforced by Canton's participant node, not by anything in this codebase.

---

## Regenerating TypeScript bindings after a contract change

```bash
cd daml/main && dpm build && cd ../..
dpm codegen-js daml/main/.daml/dist/daml-main-0.0.1.dar \
  -o frontend/src/generated/daml.js -s daml.js
cd frontend && npm run generate:api
```
