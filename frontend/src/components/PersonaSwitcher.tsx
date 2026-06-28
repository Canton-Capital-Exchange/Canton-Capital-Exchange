import { PERSONA_META, PERSONA_ORDER, type PersonaId } from "../ledger/parties";

export function PersonaSwitcher({
  active,
  onChange,
  pending,
  partyId,
}: {
  active: PersonaId;
  onChange: (id: PersonaId) => void;
  pending: boolean;
  partyId?: string;
}) {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="font-mono text-sm font-semibold tracking-tight text-slate-100">
            CCX <span className="text-violet-400">/</span> Canton Capital Exchange
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3 text-xs">
          <span className="hidden text-slate-500 sm:inline">Active Persona (Live Canton Node):</span>
          <select
            value={active}
            onChange={(e) => onChange(e.target.value as PersonaId)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs font-medium text-slate-100 focus:border-violet-500 focus:outline-none"
          >
            {PERSONA_ORDER.map((id) => (
              <option key={id} value={id}>
                {PERSONA_META[id].role} ({PERSONA_META[id].displayName})
              </option>
            ))}
          </select>
          <span
            className={`hidden h-1.5 w-1.5 rounded-full sm:inline ${pending ? "bg-amber-400" : "bg-slate-700"}`}
            title={pending ? "Syncing with ledger..." : "Up to date"}
          />
          {partyId && (
            <span className="hidden font-mono text-[10px] text-slate-600 lg:inline" title={partyId}>
              {partyId.slice(0, 24)}…
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
