import type { PersonaView } from "../ledger/client";
import { Badge, EmptyState, Mono, Panel, PanelHeader } from "../components/ui";
import { displayName, money, shortDate, bpsToPercent, percent } from "../lib/format";

export function AuditorDashboard({ view }: { view: PersonaView }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-amber-900/60 bg-amber-950/30 px-4 py-3">
        <span className="text-base">🔒</span>
        <p className="text-xs text-amber-300">
          Bidding phase hidden by Canton Privacy Layer. RegNode is not a signatory or observer of any
          <span className="font-mono"> InvoiceDraft</span>, <span className="font-mono">VerifiedInvoice</span>,
          <span className="font-mono"> FinancingInvitation</span>, or <span className="font-mono">Quote</span> contract --
          there is no field being redacted here, those contracts are structurally absent from this query result.
        </p>
      </div>

      <Panel>
        <PanelHeader
          title="Compliance Stream"
          subtitle="Finalized, funded invoices only -- the only contract type this party is ever made an observer of"
          right={<Badge tone="emerald">{view.fundedInvoices.length} funded</Badge>}
        />
        {view.fundedInvoices.length === 0 ? (
          <EmptyState>No funded invoices on record yet.</EmptyState>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="px-4 py-2 font-medium">Invoice</th>
                <th className="px-4 py-2 font-medium">Supplier</th>
                <th className="px-4 py-2 font-medium">Buyer</th>
                <th className="px-4 py-2 font-medium">Lender</th>
                <th className="px-4 py-2 font-medium">Face Value</th>
                <th className="px-4 py-2 font-medium">Advance</th>
                <th className="px-4 py-2 font-medium">Yield</th>
                <th className="px-4 py-2 font-medium">Funded</th>
                <th className="px-4 py-2 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {view.fundedInvoices.map((f) => (
                <tr key={f.contractId}>
                  <td className="px-4 py-2"><Mono>{f.payload.invoiceId}</Mono></td>
                  <td className="px-4 py-2 text-slate-300">{displayName(f.payload.supplier)}</td>
                  <td className="px-4 py-2 text-slate-300">{displayName(f.payload.buyer)}</td>
                  <td className="px-4 py-2 text-slate-300">{displayName(f.payload.lender)}</td>
                  <td className="px-4 py-2 text-slate-400">{money(f.payload.faceValue, f.payload.currency)}</td>
                  <td className="px-4 py-2 text-slate-400">{money(f.payload.advanceAmount, f.payload.currency)} ({percent(f.payload.advanceRate)})</td>
                  <td className="px-4 py-2 text-slate-400">{bpsToPercent(f.payload.yieldBps)}</td>
                  <td className="px-4 py-2 text-slate-500">{shortDate(f.payload.fundingDate)}</td>
                  <td className="px-4 py-2 text-slate-500">{shortDate(f.payload.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
