// Static persona metadata. Party IDs are NOT hardcoded here -- Canton mints
// a fresh namespace fingerprint suffix for every party allocation, and that
// fingerprint changes whenever the participant's signing key changes (e.g.
// any sandbox restart with non-persistent storage, including every
// container restart in the Docker setup). Party IDs are resolved at runtime
// by ledger/bootstrap.ts and made available via ledger/PartiesProvider.

export type PersonaId = "supplier" | "buyer" | "lenderA" | "lenderB" | "auditor";

export interface PersonaMeta {
  id: PersonaId;
  hint: string;
  displayName: string;
  role: string;
}

export const PERSONA_META: Record<PersonaId, PersonaMeta> = {
  supplier: { id: "supplier", hint: "Alice", displayName: "Alice", role: "Supplier" },
  buyer: { id: "buyer", hint: "Bob", displayName: "Bob", role: "Buyer" },
  lenderA: { id: "lenderA", hint: "AlphaBank", displayName: "Alpha Bank", role: "Lender A" },
  lenderB: { id: "lenderB", hint: "BetaVentures", displayName: "Beta Ventures", role: "Lender B" },
  auditor: { id: "auditor", hint: "RegNode", displayName: "RegNode", role: "Auditor" },
};

export const PERSONA_ORDER: PersonaId[] = ["supplier", "buyer", "lenderA", "lenderB", "auditor"];

/**
 * Populated once by bootstrap.ts after parties are resolved/allocated.
 * Read by lib/format.ts to turn a raw party ID back into a display name.
 * Safe to treat as populated everywhere else in the app because nothing
 * renders until PartiesProvider's resolution completes (see App.tsx).
 */
export const partyIdToPersona = new Map<string, PersonaMeta>();
