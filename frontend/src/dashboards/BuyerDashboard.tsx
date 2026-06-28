import type { PersonaView } from "../ledger/client";
import { verifyInvoice } from "../ledger/client";
import { Badge, Button, EmptyState, Mono, Panel, PanelHeader } from "../components/ui";
import { displayName, daysUntil, money, shortDate } from "../lib/format";

function dueBadge(dueDate: string) {
  const days = daysUntil(dueDate);
  if (days < 0) return <Badge tone="rose">Overdue</Badge>;
  if (days <= 14) return <Badge tone="amber">Due in {days}d</Badge>;
  return <Badge tone="neutral">Due in {days}d</Badge>;
}

export function BuyerDashboard({
  parties,
  view,
  refresh,
}: {
  parties: { buyer: string };
  view: PersonaView;
  refresh: () => void;
}) {
  const { buyer } = parties;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel>
        <PanelHeader title="Pending Verifications" subtitle="Countersign to make an invoice eligible for the financing market" />
        {view.invoiceDrafts.length === 0 ? (
          <EmptyState>Nothing awaiting your signature.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.invoiceDrafts.map((d) => (
              <li key={d.contractId} className="flex items-center justify-between px-4 py-3">
                <div>
                  <Mono className="text-sm text-slate-200">{d.payload.invoiceId}</Mono>
                  <div className="text-xs text-slate-500">{money(d.payload.faceValue, d.payload.currency)} · {d.payload.description}</div>
                </div>
                <Button onClick={async () => { await verifyInvoice(buyer, d.contractId); refresh(); }}>
                  Verify &amp; Sign
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
        <PanelHeader title="Verified, Awaiting Market" subtitle="Co-signed; the Supplier may open these to Lenders at any time" />
        {view.verifiedInvoices.length === 0 ? (
          <EmptyState>Nothing in this state.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.verifiedInvoices.map((v) => (
              <li key={v.contractId} className="flex items-center justify-between px-4 py-3">
                <Mono className="text-sm text-slate-200">{v.payload.invoiceId}</Mono>
                <div className="text-xs text-slate-500">{money(v.payload.faceValue, v.payload.currency)}</div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="lg:col-span-2">
        <PanelHeader title="Accounts Payable" subtitle="Funded invoices -- the receivable has been assigned to a Lender, who you now owe" />
        {view.fundedInvoices.length === 0 ? (
          <EmptyState>No outstanding payables.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.fundedInvoices
              .slice()
              .sort((a, b) => a.payload.dueDate.localeCompare(b.payload.dueDate))
              .map((f) => (
                <li key={f.contractId} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <Mono className="text-sm text-slate-200">{f.payload.invoiceId}</Mono>
                    <div className="text-xs text-slate-500">
                      Pay {money(f.payload.faceValue, f.payload.currency)} to {displayName(f.payload.lender)} by {shortDate(f.payload.dueDate)}
                    </div>
                  </div>
                  {dueBadge(f.payload.dueDate)}
                </li>
              ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
