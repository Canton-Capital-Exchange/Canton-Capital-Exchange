import { useState, useEffect } from "react";
import { PersonaSwitcher } from "./components/PersonaSwitcher";
import { useLedgerView } from "./hooks/useLedgerView";
import { PartiesProvider, useParties } from "./ledger/PartiesProvider";
import { PERSONA_META, type PersonaId } from "./ledger/parties";
import type { PersonaView } from "./ledger/client";
import { SupplierDashboard } from "./dashboards/SupplierDashboard";
import { BuyerDashboard } from "./dashboards/BuyerDashboard";
import { LenderDashboard } from "./dashboards/LenderDashboard";
import { AuditorDashboard } from "./dashboards/AuditorDashboard";
import { USE_REAL_TOKENS } from "./ledger/config";
import { initAuth, loginRedirect, logout, AUTH_MODE } from "./ledger/auth";
import { setAuthToken } from "./ledger/http";

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
    return <p className="px-6 py-16 text-center text-sm text-slate-500">Connecting to Canton…</p>;
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
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-slate-600">
              {USE_REAL_TOKENS ? "Canton DevNet" : "JSON Ledger API · localhost:7575"}
            </span>
            {USE_REAL_TOKENS && AUTH_MODE === "keycloak" && (
              <button
                onClick={logout}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                Log out
              </button>
            )}
          </div>
        </div>
        {(error || bootError) && (
          <div className="mb-4 rounded-md border border-rose-900 bg-rose-950/40 px-4 py-2 text-xs text-rose-300">
            Ledger query failed: {error ?? bootError}
          </div>
        )}
        {!parties ? (
          <p className="px-6 py-16 text-center text-sm text-slate-500">
            {USE_REAL_TOKENS
              ? "Connecting to Canton DevNet…"
              : "Resolving Canton parties (allocating if this is a fresh sandbox)…"}
          </p>
        ) : (
          <Dashboard persona={persona} parties={parties} view={view} refresh={refresh} />
        )}
      </main>
    </div>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authed" | "needs_login">(
    USE_REAL_TOKENS ? "loading" : "authed",
  );
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_REAL_TOKENS) return;
    initAuth(setAuthToken)
      .then((r) => setStatus(r === "sandbox" ? "authed" : r))
      .catch((e: unknown) => {
        setAuthError(e instanceof Error ? e.message : String(e));
        setStatus("needs_login");
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#0b0f17,#05070a_60%)] flex items-center justify-center">
        <p className="text-sm text-slate-400">Connecting to Canton…</p>
      </div>
    );
  }

  if (status === "needs_login") {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#0b0f17,#05070a_60%)] flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-100 mb-2">CCX Invoice Financing</h1>
          <p className="text-sm text-slate-400">Canton Credit Exchange — DevNet</p>
        </div>
        {authError && (
          <p className="text-xs text-rose-400 max-w-sm text-center">{authError}</p>
        )}
        <button
          onClick={() => { void loginRedirect(); }}
          className="px-6 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Login with Canton
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthGate>
      <PartiesProvider>
        <AppShell />
      </PartiesProvider>
    </AuthGate>
  );
}
