import { useState } from "react";
import type { PersonaView } from "../ledger/client";
import { declineInvitation, submitQuote } from "../ledger/client";
import { Badge, Button, EmptyState, Field, Mono, Panel, PanelHeader, inputClass } from "../components/ui";
import { money, percent, shortDate, bpsToPercent } from "../lib/format";

function QuoteDrawer({
  lender,
  invitationCid,
  maxAdvanceRate,
  biddingDeadline,
  cashHoldings,
  onDone,
}: {
  lender: string;
  invitationCid: string;
  maxAdvanceRate: string;
  biddingDeadline: string;
  cashHoldings: PersonaView["cashHoldings"];
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [advanceRate, setAdvanceRate] = useState(maxAdvanceRate);
  const [yieldBps, setYieldBps] = useState("450");
  const [fundingDeadline, setFundingDeadline] = useState(biddingDeadline);
  const [cashHoldingCid, setCashHoldingCid] = useState(cashHoldings[0]?.contractId ?? "");
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" onClick={async () => { await declineInvitation(lender, invitationCid); onDone(); }}>
          Decline
        </Button>
        <Button onClick={() => setOpen(true)} disabled={cashHoldings.length === 0}>
          Submit Private Quote
        </Button>
      </div>
    );
  }

  return (
    <form
      className="mt-3 grid grid-cols-2 gap-3 rounded-md border border-slate-800 bg-slate-900/60 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await submitQuote(lender, invitationCid, { advanceRate, yieldBps, fundingDeadline, cashHoldingCid });
          onDone();
        } finally {
          setBusy(false);
        }
      }}
    >
      <Field label={`Advance Rate (cap ${percent(maxAdvanceRate)})`}>
        <input className={inputClass} type="number" min="0" max={maxAdvanceRate} step="0.01" value={advanceRate} onChange={(e) => setAdvanceRate(e.target.value)} required />
      </Field>
      <Field label="Yield (bps)">
        <input className={inputClass} type="number" min="0" step="1" value={yieldBps} onChange={(e) => setYieldBps(e.target.value)} required />
      </Field>
      <Field label="Funding By">
        <input className={inputClass} type="date" value={fundingDeadline} onChange={(e) => setFundingDeadline(e.target.value)} required />
      </Field>
      <Field label="Fund From">
        <select className={inputClass} value={cashHoldingCid} onChange={(e) => setCashHoldingCid(e.target.value)} required>
          {cashHoldings.map((c) => (
            <option key={c.contractId} value={c.contractId}>
              {money(c.payload.amount, c.payload.currency)}
            </option>
          ))}
        </select>
      </Field>
      <div className="col-span-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit Quote"}</Button>
      </div>
    </form>
  );
}

export function LenderDashboard({
  lender,
  displayName,
  view,
  refresh,
}: {
  lender: string;
  displayName: string;
  view: PersonaView;
  refresh: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel>
        <PanelHeader
          title="Open Invitations"
          subtitle={`Visible only to ${displayName} -- other Lenders invited on the same invoice are never disclosed here`}
        />
        {view.financingInvitations.length === 0 ? (
          <EmptyState>No invitations open right now.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.financingInvitations.map((inv) => (
              <li key={inv.contractId} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Mono className="text-sm text-slate-200">{inv.payload.invoiceId}</Mono>
                    <div className="text-xs text-slate-500">
                      {money(inv.payload.faceValue, inv.payload.currency)} · cap {percent(inv.payload.maxAdvanceRate)} · bid by {shortDate(inv.payload.biddingDeadline)}
                    </div>
                  </div>
                  <Badge tone="violet">Blind Auction</Badge>
                </div>
                <QuoteDrawer
                  lender={lender}
                  invitationCid={inv.contractId}
                  maxAdvanceRate={inv.payload.maxAdvanceRate}
                  biddingDeadline={inv.payload.biddingDeadline}
                  cashHoldings={view.cashHoldings}
                  onDone={refresh}
                />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
        <PanelHeader title="My Cash Holdings" subtitle="Simulated tokenized deposits (USDCx) available to fund quotes" />
        {view.cashHoldings.length === 0 ? (
          <EmptyState>No cash holdings.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.cashHoldings.map((c) => (
              <li key={c.contractId} className="flex items-center justify-between px-4 py-3">
                <Mono className="text-sm text-slate-200">{money(c.payload.amount, c.payload.currency)}</Mono>
                <Badge>Available</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
        <PanelHeader title="My Outstanding Quotes" subtitle="Awaiting the Supplier's decision" />
        {view.quotes.length === 0 ? (
          <EmptyState>No outstanding quotes.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.quotes.map((q) => (
              <li key={q.contractId} className="flex items-center justify-between px-4 py-3">
                <Mono className="text-sm text-slate-200">{q.payload.invoiceId}</Mono>
                <div className="text-xs text-slate-500">
                  Advance {percent(q.payload.advanceRate)} · Yield {bpsToPercent(q.payload.yieldBps)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel>
        <PanelHeader title="Funded Deals" subtitle="Settled atomically: cash moved and the receivable assigned in one transaction" />
        {view.fundedInvoices.length === 0 ? (
          <EmptyState>Nothing funded yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.fundedInvoices.map((f) => (
              <li key={f.contractId} className="flex items-center justify-between px-4 py-3">
                <Mono className="text-sm text-slate-200">{f.payload.invoiceId}</Mono>
                <div className="text-xs text-slate-500">{money(f.payload.advanceAmount, f.payload.currency)} advanced</div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
