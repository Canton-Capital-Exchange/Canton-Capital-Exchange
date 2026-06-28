import { useState } from "react";
import type { PersonaView } from "../ledger/client";
import { acceptQuote, openForFinancing, rejectQuote, tokenizeInvoice, withdrawDraft } from "../ledger/client";
import { PERSONA_META, type PersonaId } from "../ledger/parties";
import { Badge, Button, EmptyState, Field, Mono, Panel, PanelHeader, inputClass } from "../components/ui";
import { displayName, money, percent, shortDate, bpsToPercent } from "../lib/format";

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().slice(0, 10);
}

function defaultBiddingDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function TokenizeForm({ supplier, buyer, onDone }: { supplier: string; buyer: string; onDone: () => void }) {
  const [invoiceId, setInvoiceId] = useState(() => `INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [faceValue, setFaceValue] = useState("100000");
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="grid grid-cols-2 gap-3 p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await tokenizeInvoice(supplier, { buyer, invoiceId, faceValue, currency, dueDate, description });
          onDone();
        } finally {
          setBusy(false);
        }
      }}
    >
      <Field label="Invoice ID">
        <input className={inputClass} value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} required />
      </Field>
      <Field label="Face Value">
        <input className={inputClass} type="number" min="0" step="0.01" value={faceValue} onChange={(e) => setFaceValue(e.target.value)} required />
      </Field>
      <Field label="Currency">
        <input className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)} required />
      </Field>
      <Field label="Due Date">
        <input className={inputClass} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      </Field>
      <div className="col-span-2">
        <Field label="Description">
          <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Q1 hardware delivery" required />
        </Field>
      </div>
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Tokenize Invoice"}</Button>
      </div>
    </form>
  );
}

function OpenFinancingForm({
  supplier,
  lenderAPartyId,
  lenderBPartyId,
  verifiedInvoiceCid,
  paymentObligationCid,
  onDone,
}: {
  supplier: string;
  lenderAPartyId: string;
  lenderBPartyId: string;
  verifiedInvoiceCid: string;
  paymentObligationCid: string;
  onDone: () => void;
}) {
  const [lenderA, setLenderA] = useState(true);
  const [lenderB, setLenderB] = useState(true);
  const [maxAdvanceRate, setMaxAdvanceRate] = useState("0.9");
  const [biddingDeadline, setBiddingDeadline] = useState(defaultBiddingDeadline());
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        Request Financing
      </Button>
    );
  }

  const lenders = [
    lenderA ? lenderAPartyId : null,
    lenderB ? lenderBPartyId : null,
  ].filter((p): p is string => !!p);

  return (
    <form
      className="mt-3 grid grid-cols-2 gap-3 rounded-md border border-slate-800 bg-slate-900/60 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (lenders.length === 0) return;
        setBusy(true);
        try {
          await openForFinancing(supplier, verifiedInvoiceCid, {
            lenders,
            maxAdvanceRate,
            biddingDeadline,
            paymentObligationCid,
          });
          onDone();
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="col-span-2 flex gap-4 text-xs text-slate-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lenderA} onChange={(e) => setLenderA(e.target.checked)} /> {PERSONA_META.lenderA.displayName}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lenderB} onChange={(e) => setLenderB(e.target.checked)} /> {PERSONA_META.lenderB.displayName}
        </label>
      </div>
      <Field label="Max Advance Rate">
        <input className={inputClass} type="number" min="0" max="1" step="0.01" value={maxAdvanceRate} onChange={(e) => setMaxAdvanceRate(e.target.value)} required />
      </Field>
      <Field label="Bidding Deadline">
        <input className={inputClass} type="date" value={biddingDeadline} onChange={(e) => setBiddingDeadline(e.target.value)} required />
      </Field>
      <div className="col-span-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit" disabled={busy || lenders.length === 0}>{busy ? "Opening…" : "Open Blind Auction"}</Button>
      </div>
    </form>
  );
}

export function SupplierDashboard({
  parties,
  view,
  refresh,
}: {
  parties: Record<PersonaId, string>;
  view: PersonaView;
  refresh: () => void;
}) {
  const { supplier, buyer, auditor, lenderA, lenderB } = parties;
  const paymentObligationFor = (invoiceId: string) =>
    view.paymentObligations.find((po) => po.payload.invoiceId === invoiceId)?.contractId;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel>
        <PanelHeader title="Tokenize Receivable" subtitle={`Create a new invoice claim for ${PERSONA_META.buyer.displayName} to countersign`} />
        <TokenizeForm supplier={supplier} buyer={buyer} onDone={refresh} />
      </Panel>

      <Panel>
        <PanelHeader title="Awaiting Buyer Verification" subtitle="Mutual-verification stage -- not yet market eligible" />
        {view.invoiceDrafts.length === 0 ? (
          <EmptyState>No drafts pending.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.invoiceDrafts.map((d) => (
              <li key={d.contractId} className="flex items-center justify-between px-4 py-3">
                <div>
                  <Mono className="text-sm text-slate-200">{d.payload.invoiceId}</Mono>
                  <div className="text-xs text-slate-500">{money(d.payload.faceValue, d.payload.currency)} · due {shortDate(d.payload.dueDate)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="amber">Awaiting {PERSONA_META.buyer.displayName}</Badge>
                  <Button variant="ghost" onClick={async () => { await withdrawDraft(supplier, d.contractId); refresh(); }}>Withdraw</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="lg:col-span-2">
        <PanelHeader title="Verified — Ready For Market" subtitle="Co-signed by Supplier and Buyer; not yet visible to any Lender until opened" />
        {view.verifiedInvoices.length === 0 ? (
          <EmptyState>Nothing verified yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.verifiedInvoices.map((v) => (
              <li key={v.contractId} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Mono className="text-sm text-slate-200">{v.payload.invoiceId}</Mono>
                    <div className="text-xs text-slate-500">{money(v.payload.faceValue, v.payload.currency)} · due {shortDate(v.payload.dueDate)}</div>
                  </div>
                  <Badge tone="emerald">Verified</Badge>
                </div>
                {paymentObligationFor(v.payload.invoiceId) && (
                  <OpenFinancingForm
                    supplier={supplier}
                    lenderAPartyId={lenderA}
                    lenderBPartyId={lenderB}
                    verifiedInvoiceCid={v.contractId}
                    paymentObligationCid={paymentObligationFor(v.payload.invoiceId)!}
                    onDone={refresh}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="lg:col-span-2">
        <PanelHeader title="Inbound Competitive Bids" subtitle="Each Lender's quote is private to them and you alone -- you see every bid, but no Lender sees another's" />
        {view.quotes.length === 0 ? (
          <EmptyState>No quotes submitted yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.quotes.map((q) => (
              <li key={q.contractId} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Mono className="text-sm text-slate-200">{q.payload.invoiceId}</Mono>
                    <Badge tone="violet">{displayName(q.payload.lender)}</Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Advance {percent(q.payload.advanceRate)} · Yield {bpsToPercent(q.payload.yieldBps)} · by {shortDate(q.payload.fundingDeadline)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    onClick={async () => { await rejectQuote(supplier, q.contractId); refresh(); }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={async () => {
                      await acceptQuote(supplier, q.payload.lender, q.contractId, {
                        auditor,
                        fundingDate: new Date().toISOString().slice(0, 10),
                      });
                      refresh();
                    }}
                  >
                    Accept Offer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="lg:col-span-2">
        <PanelHeader title="Settled" subtitle="Funded invoices -- now also visible to RegNode for compliance" />
        {view.fundedInvoices.length === 0 ? (
          <EmptyState>Nothing funded yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-slate-800">
            {view.fundedInvoices.map((f) => (
              <li key={f.contractId} className="flex items-center justify-between px-4 py-3">
                <Mono className="text-sm text-slate-200">{f.payload.invoiceId}</Mono>
                <div className="text-xs text-slate-500">
                  {money(f.payload.advanceAmount, f.payload.currency)} advanced by {displayName(f.payload.lender)}
                </div>
                <Badge tone="emerald">Funded</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
