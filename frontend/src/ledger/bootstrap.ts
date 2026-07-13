import { Cash } from "@daml.js/daml-main-0.0.1";
import { client, unwrap } from "./http";
import { fetchPersonaView } from "./client";
import { PERSONA_META, PERSONA_ORDER, partyIdToPersona, type PersonaId } from "./parties";

// Set VITE_REAL_TOKENS=true when running against DevNet with real cETH/raUSD.
// Skips CashHolding+CcxTransferFactory seeding; lenders fund via the wallet faucet instead.
export const USE_REAL_TOKENS = import.meta.env.VITE_REAL_TOKENS === "true";

const LENDER_SEED_CASH: Partial<Record<PersonaId, { amount: string; currency: string }>> = {
  lenderA: { amount: "5000000", currency: "cETH" },
  lenderB: { amount: "3000000", currency: "cBTC" },
};

async function listKnownParties(): Promise<string[]> {
  const { data, error } = await client.GET("/v2/parties");
  return unwrap(data, error).partyDetails?.map((p) => p.party) ?? [];
}

async function allocateParty(hint: string): Promise<string> {
  const { data, error } = await client.POST("/v2/parties", {
    body: { partyIdHint: hint, identityProviderId: "" },
  });
  return unwrap(data, error).partyDetails.party;
}

async function seedCashHolding(owner: string, amount: string, currency: string) {
  await client.POST("/v2/commands/submit-and-wait", {
    body: {
      commands: [{
        CreateCommand: {
          templateId: Cash.CashHolding.templateId,
          createArguments: { owner, admin: owner, currency, amount },
        },
      }],
      commandId: `seed-cash-${crypto.randomUUID()}`,
      actAs: [owner],
      readAs: [owner],
      userId: "ccx-app",
    },
  });
}

async function seedTransferFactory(admin: string, observers: string[]) {
  await client.POST("/v2/commands/submit-and-wait", {
    body: {
      commands: [{
        CreateCommand: {
          templateId: Cash.CcxTransferFactory.templateId,
          createArguments: { admin, observers },
        },
      }],
      commandId: `seed-factory-${crypto.randomUUID()}`,
      actAs: [admin],
      readAs: [],
      userId: "ccx-app",
    },
  });
}

/**
 * Resolves the five demo parties by hint, allocating any that don't exist
 * yet, then ensures each Lender has at least one CashHolding to bid with.
 * This makes the whole app self-healing against a freshly booted sandbox --
 * whether that's a local `dpm sandbox` restart or a fresh Docker container
 * with no persisted participant state -- without any party ID ever being
 * hardcoded in source.
 */
export async function resolveParties(): Promise<Record<PersonaId, string>> {
  const known = await listKnownParties();
  const result = {} as Record<PersonaId, string>;

  for (const id of PERSONA_ORDER) {
    const meta = PERSONA_META[id];
    const prefix = `${meta.hint}::`;
    const existing = known.find((p) => p.startsWith(prefix));
    const partyId = existing ?? (await allocateParty(meta.hint));
    result[id] = partyId;
    partyIdToPersona.set(partyId, meta);
  }

  if (!USE_REAL_TOKENS) {
    const allParties = Object.values(result);
    for (const [id, seed] of Object.entries(LENDER_SEED_CASH) as [PersonaId, { amount: string; currency: string }][]) {
      const partyId = result[id];
      const view = await fetchPersonaView(partyId);
      if (view.cashHoldings.length === 0) {
        await seedCashHolding(partyId, seed.amount, seed.currency);
        await seedTransferFactory(partyId, allParties);
      }
    }
  }
  // On DevNet (USE_REAL_TOKENS=true): lenders receive cETH/raUSD via the
  // hackathon wallet faucet. Holdings and TransferFactory contracts come
  // from the real Splice token registries -- no seeding needed here.

  return result;
}
