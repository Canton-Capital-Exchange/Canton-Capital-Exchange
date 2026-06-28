import { Cash, Invoicing } from "@daml.js/daml-main-0.0.1";
import type { components } from "../generated/ledger-api";
import { client, unwrap } from "./http";

type Command = components["schemas"]["Command"];
type CreatedEvent = components["schemas"]["CreatedEvent"];

export interface LedgerContract<T> {
  contractId: string;
  templateId: string;
  payload: T;
}

function newCommandId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function ledgerEnd(): Promise<number> {
  const { data, error } = await client.GET("/v2/state/ledger-end");
  return unwrap(data, error).offset ?? 0;
}

/**
 * Submits a single atomic transaction. `readAs` brings a counterparty's
 * otherwise-invisible contracts (e.g. a Lender's CashHolding) into scope for
 * fetches performed during interpretation -- see the comment on Quote_Accept
 * in daml/main/daml/Invoicing.daml for why this matters for atomic settlement.
 */
async function submit(
  actAs: string[],
  commands: Command[],
  commandId: string,
  readAs: string[] = [],
) {
  const { data, error } = await client.POST("/v2/commands/submit-and-wait", {
    body: {
      commands,
      commandId,
      actAs,
      readAs,
      userId: "ccx-app",
    },
  });
  return unwrap(data, error);
}

/**
 * Queries the ledger AS `party`. No filtering happens on the client: the
 * JSON Ledger API only ever returns contracts for which `party` is a
 * signatory or observer, so switching personas in the UI re-runs this
 * against a different party and the privacy boundary is enforced by Canton
 * itself, not by anything in this codebase.
 */
async function queryActiveContracts(party: string): Promise<CreatedEvent[]> {
  const offset = await ledgerEnd();
  if (offset === 0) return [];
  const { data, error } = await client.POST("/v2/state/active-contracts", {
    body: {
      activeAtOffset: offset,
      eventFormat: {
        filtersByParty: {
          [party]: { cumulative: [{ identifierFilter: { WildcardFilter: { value: {} } } }] },
        },
        verbose: false,
      },
    },
  });
  const rows = unwrap(data, error);
  const events: CreatedEvent[] = [];
  for (const row of rows) {
    const entry = row.contractEntry;
    if (entry && "JsActiveContract" in entry) {
      events.push(entry.JsActiveContract.createdEvent);
    }
  }
  return events;
}

function byTemplate<T>(events: CreatedEvent[], moduleName: string, templateName: string): LedgerContract<T>[] {
  return events
    .filter((e) => e.templateId.endsWith(`:${moduleName}:${templateName}`))
    .map((e) => ({ contractId: e.contractId, templateId: e.templateId, payload: e.createArgument as T }));
}

// ----------------------------------------------------------------------------
// Per-persona reads
// ----------------------------------------------------------------------------

export interface PersonaView {
  invoiceDrafts: LedgerContract<Invoicing.InvoiceDraft>[];
  verifiedInvoices: LedgerContract<Invoicing.VerifiedInvoice>[];
  paymentObligations: LedgerContract<Invoicing.PaymentObligation>[];
  financingInvitations: LedgerContract<Invoicing.FinancingInvitation>[];
  quotes: LedgerContract<Invoicing.Quote>[];
  fundedInvoices: LedgerContract<Invoicing.FundedInvoice>[];
  cashHoldings: LedgerContract<Cash.CashHolding>[];
}

export async function fetchPersonaView(party: string): Promise<PersonaView> {
  const events = await queryActiveContracts(party);
  return {
    invoiceDrafts: byTemplate(events, "Invoicing", "InvoiceDraft"),
    verifiedInvoices: byTemplate(events, "Invoicing", "VerifiedInvoice"),
    paymentObligations: byTemplate(events, "Invoicing", "PaymentObligation"),
    financingInvitations: byTemplate(events, "Invoicing", "FinancingInvitation"),
    quotes: byTemplate(events, "Invoicing", "Quote"),
    fundedInvoices: byTemplate(events, "Invoicing", "FundedInvoice"),
    cashHoldings: byTemplate(events, "Cash", "CashHolding"),
  };
}

// ----------------------------------------------------------------------------
// Lifecycle actions -- one function per choice in Invoicing.daml
// ----------------------------------------------------------------------------

export async function tokenizeInvoice(
  supplier: string,
  args: Omit<Invoicing.InvoiceDraft, "supplier">,
) {
  await submit(
    [supplier],
    [{ CreateCommand: { templateId: Invoicing.InvoiceDraft.templateId, createArguments: { supplier, ...args } } }],
    newCommandId("tokenize"),
  );
}

export async function withdrawDraft(supplier: string, contractId: string) {
  await submit(
    [supplier],
    [{
      ExerciseCommand: {
        templateId: Invoicing.InvoiceDraft.templateId,
        contractId,
        choice: "InvoiceDraft_Withdraw",
        choiceArgument: {},
      },
    }],
    newCommandId("withdraw"),
  );
}

export async function verifyInvoice(buyer: string, contractId: string) {
  await submit(
    [buyer],
    [{
      ExerciseCommand: {
        templateId: Invoicing.InvoiceDraft.templateId,
        contractId,
        choice: "InvoiceDraft_Verify",
        choiceArgument: {},
      },
    }],
    newCommandId("verify"),
  );
}

export interface OpenForFinancingArgs {
  lenders: string[];
  maxAdvanceRate: string;
  biddingDeadline: string;
  paymentObligationCid: string;
}

export async function openForFinancing(supplier: string, contractId: string, args: OpenForFinancingArgs) {
  await submit(
    [supplier],
    [{
      ExerciseCommand: {
        templateId: Invoicing.VerifiedInvoice.templateId,
        contractId,
        choice: "VerifiedInvoice_OpenForFinancing",
        choiceArgument: args satisfies OpenForFinancingArgs as unknown as Invoicing.VerifiedInvoice_OpenForFinancing,
      },
    }],
    newCommandId("open-financing"),
  );
}

export async function declineInvitation(lender: string, contractId: string) {
  await submit(
    [lender],
    [{
      ExerciseCommand: {
        templateId: Invoicing.FinancingInvitation.templateId,
        contractId,
        choice: "FinancingInvitation_Decline",
        choiceArgument: {},
      },
    }],
    newCommandId("decline"),
  );
}

export interface SubmitQuoteArgs {
  advanceRate: string;
  yieldBps: string;
  fundingDeadline: string;
  cashHoldingCid: string;
}

export async function submitQuote(lender: string, contractId: string, args: SubmitQuoteArgs) {
  await submit(
    [lender],
    [{
      ExerciseCommand: {
        templateId: Invoicing.FinancingInvitation.templateId,
        contractId,
        choice: "FinancingInvitation_SubmitQuote",
        choiceArgument: args satisfies SubmitQuoteArgs as unknown as Invoicing.FinancingInvitation_SubmitQuote,
      },
    }],
    newCommandId("submit-quote"),
  );
}

export async function rejectQuote(supplier: string, contractId: string) {
  await submit(
    [supplier],
    [{
      ExerciseCommand: {
        templateId: Invoicing.Quote.templateId,
        contractId,
        choice: "Quote_Reject",
        choiceArgument: {},
      },
    }],
    newCommandId("reject-quote"),
  );
}

export async function acceptQuote(
  supplier: string,
  lender: string,
  contractId: string,
  args: Invoicing.Quote_Accept,
) {
  // readAs: [lender] is required here -- see the visibility note on
  // Quote_Accept in Invoicing.daml. Without it the fetch of the Lender's
  // CashHolding inside the choice body cannot resolve.
  await submit(
    [supplier],
    [{
      ExerciseCommand: {
        templateId: Invoicing.Quote.templateId,
        contractId,
        choice: "Quote_Accept",
        choiceArgument: args,
      },
    }],
    newCommandId("accept-quote"),
    [lender],
  );
}
