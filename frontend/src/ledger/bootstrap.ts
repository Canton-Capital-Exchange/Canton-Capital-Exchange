import { Cash } from "@daml.js/daml-main-0.0.1";
import { client, unwrap } from "./http";
import { fetchPersonaView } from "./client";
import { PERSONA_META, PERSONA_ORDER, partyIdToPersona, type PersonaId } from "./parties";
import { USE_REAL_TOKENS } from "./config";
import { getStoredParty, getStoredUserId } from "./auth";

export { USE_REAL_TOKENS };

const LENDER_SEED_CASH: Partial<Record<PersonaId, Array<{ amount: string; currency: string }>>> = {
  lenderA: [
    { amount: "5000000", currency: "cETH" },
    { amount: "2000000", currency: "raUSD" },
  ],
  lenderB: [
    { amount: "3000000", currency: "cBTC" },
    { amount: "1500000", currency: "raUSD" },
  ],
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

async function seedCashHolding(owner: string, amount: string, currency: string, userId: string) {
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
      userId,
    },
  });
}

async function seedTransferFactory(admin: string, observers: string[], userId: string) {
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
      userId,
    },
  });
}

/**
 * On DevNet: all personas share the single logged-in party (no allocation needed).
 * On sandbox: resolves/allocates the five demo parties and seeds lender cash holdings.
 */
export async function resolveParties(): Promise<Record<PersonaId, string>> {
  const userId = getStoredUserId();

  if (USE_REAL_TOKENS) {
    const party = getStoredParty();
    if (!party) throw new Error("No party resolved — auth must complete before resolveParties()");
    const result = {} as Record<PersonaId, string>;
    for (const id of PERSONA_ORDER) {
      result[id] = party;
      partyIdToPersona.set(party, PERSONA_META[id]);
    }
    // Seed demo holdings for the machine party if not yet present
    const view = await fetchPersonaView(party);
    if (view.cashHoldings.length === 0) {
      await seedTransferFactory(party, [party], userId);
      for (const seeds of Object.values(LENDER_SEED_CASH)) {
        for (const seed of seeds) {
          await seedCashHolding(party, seed.amount, seed.currency, userId);
        }
      }
    }
    return result;
  }

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

  const allParties = Object.values(result);
  for (const [id, seeds] of Object.entries(LENDER_SEED_CASH) as [PersonaId, Array<{ amount: string; currency: string }>][]) {
    const partyId = result[id];
    const view = await fetchPersonaView(partyId);
    if (view.cashHoldings.length === 0) {
      await seedTransferFactory(partyId, allParties, userId);
      for (const seed of seeds) {
        await seedCashHolding(partyId, seed.amount, seed.currency, userId);
      }
    }
  }

  return result;
}
