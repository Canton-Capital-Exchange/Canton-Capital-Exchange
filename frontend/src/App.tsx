import { useState } from "react";
import { PersonaSwitcher } from "./components/PersonaSwitcher";
import { useLedgerView } from "./hooks/useLedgerView";
import { PartiesProvider, useParties } from "./ledger/PartiesProvider";
import { PERSONA_META, type PersonaId } from "./ledger/parties";
import type { PersonaView } from "./ledger/client";
import { SupplierDashboard } from "./dashboards/SupplierDashboard";
import { BuyerDashboard } from "./dashboards/BuyerDashboard";
import { LenderDashboard } from "./dashboards/LenderDashboard";
import { AuditorDashboard } from "./dashboards/AuditorDashboard";

function Dashboard({
  persona,
  parties,
  view,
  refresh,
}: {
  persona: PersonaId;
  parties: Record<PersonaId, string>;
  view: PersonaView | null;
  refresh: () => void;
}) {
  if (!view) {
    return <p className="px-6 py-16 text-center text-sm text-slate-500">Connecting to local Canton node…</p>;
  }
  switch (persona) {
    case "supplier":
      return <SupplierDashboard parties={parties} view={view} refresh={refresh} />;
    case "buyer":
      return <BuyerDashboard parties={parties} view={view} refresh={refresh} />;
    case "lenderA":
      return (
        <LenderDashboard lender={parties.lenderA} displayName={PERSONA_META.lenderA.displayName} view={view} refresh={refresh} />
      );
    case "lenderB":
      return (
        <LenderDashboard lender={parties.lenderB} displayName={PERSONA_META.lenderB.displayName} view={view} refresh={refresh} />
      );
    case "auditor":
      return <AuditorDashboard view={view} />;
  }
}

function AppShell() {
  const [persona, setPersona] = useState<PersonaId>("supplier");
  const { parties, error: bootError } = useParties();
  const { view, pending, error, refresh } = useLedgerView(parties?.[persona] ?? "");

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#0b0f17,#05070a_60%)] text-slate-100">
      <PersonaSwitcher active={persona} onChange={setPersona} pending={pending} partyId={parties?.[persona]} />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h1 className="text-sm font-medium text-slate-300">
            {PERSONA_META[persona].role} Terminal <span className="text-slate-600">/ {PERSONA_META[persona].displayName}</span>
          </h1>
          <span className="font-mono text-[11px] text-slate-600">JSON Ledger API · localhost:7575</span>
        </div>
        {(error || bootError) && (
          <div className="mb-4 rounded-md border border-rose-900 bg-rose-950/40 px-4 py-2 text-xs text-rose-300">
            Ledger query failed: {error ?? bootError}
          </div>
        )}
        {!parties ? (
          <p className="px-6 py-16 text-center text-sm text-slate-500">
            Resolving Canton parties (allocating if this is a fresh sandbox)…
          </p>
        ) : (
          <Dashboard persona={persona} parties={parties} view={view} refresh={refresh} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PartiesProvider>
      <AppShell />
    </PartiesProvider>
  );
}
