import { Cash } from "@daml.js/daml-main-0.0.1";
import { client, unwrap } from "./http";
import { fetchPersonaView } from "./client";
import { PERSONA_META, PERSONA_ORDER, partyIdToPersona, type PersonaId } from "./parties";

const LENDER_SEED_CASH: Partial<Record<PersonaId, string>> = {
  lenderA: "5000000",
  lenderB: "3000000",
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

async function seedCashHolding(owner: string, amount: string) {
  await client.POST("/v2/commands/submit-and-wait", {
    body: {
      commands: [{
        CreateCommand: {
          templateId: Cash.CashHolding.templateId,
          createArguments: { owner, currency: "USDCx", amount },
        },
      }],
      commandId: `seed-cash-${crypto.randomUUID()}`,
      actAs: [owner],
      readAs: [owner],
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

  for (const [id, amount] of Object.entries(LENDER_SEED_CASH) as [PersonaId, string][]) {
    const partyId = result[id];
    const view = await fetchPersonaView(partyId);
    if (view.cashHoldings.length === 0) {
      await seedCashHolding(partyId, amount);
    }
  }

  return result;
}
