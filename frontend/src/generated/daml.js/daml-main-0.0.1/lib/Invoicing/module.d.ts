// Generated from ../Invoicing/module.daml

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281 from '@daml.js/splice-api-token-transfer-instruction-v1-1.0.0';
import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from '@daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b from '@daml.js/splice-api-token-holding-v1-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type FinancingInvitation = {
  supplier: damlTypes.Party,
  buyer: damlTypes.Party,
  lender: damlTypes.Party,
  invoiceId: string,
  faceValue: damlTypes.Numeric,
  currency: string,
  dueDate: damlTypes.Date,
  description: string,
  maxAdvanceRate: damlTypes.Numeric,
  biddingDeadline: damlTypes.Date,
  paymentObligationCid: damlTypes.ContractId<PaymentObligation>,
}

export declare interface FinancingInvitationInterface {
  Archive: 
    damlTypes.Choice<FinancingInvitation, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<FinancingInvitation, undefined>>;
  FinancingInvitation_Cancel:
    damlTypes.Choice<FinancingInvitation, FinancingInvitation_Cancel, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<FinancingInvitation, undefined>>;
  FinancingInvitation_Decline:
    damlTypes.Choice<FinancingInvitation, FinancingInvitation_Decline, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<FinancingInvitation, undefined>>;
  FinancingInvitation_SubmitQuote:
    damlTypes.Choice<FinancingInvitation, FinancingInvitation_SubmitQuote, damlTypes.ContractId<Quote>, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<FinancingInvitation, undefined>>;
}
export declare const FinancingInvitation:
  damlTypes.Template<FinancingInvitation, undefined, '#daml-main:Invoicing:FinancingInvitation'> &
  damlTypes.ToInterface<FinancingInvitation, never> &
  FinancingInvitationInterface

export declare type FinancingInvitation_Cancel = {
}

export declare const FinancingInvitation_Cancel:
  damlTypes.Serializable<FinancingInvitation_Cancel>

export declare type FinancingInvitation_Decline = {
}

export declare const FinancingInvitation_Decline:
  damlTypes.Serializable<FinancingInvitation_Decline>

export declare type FinancingInvitation_SubmitQuote = {
  advanceRate: damlTypes.Numeric,
  yieldBps: damlTypes.Int,
  fundingDeadline: damlTypes.Date,
  holdingCid: damlTypes.ContractId<pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding>,
  transferFactoryCid: damlTypes.ContractId<pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory>,
  instrumentId: pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.InstrumentId,
}

export declare const FinancingInvitation_SubmitQuote:
  damlTypes.Serializable<FinancingInvitation_SubmitQuote>

export declare type FundedInvoice = {
  supplier: damlTypes.Party,
  buyer: damlTypes.Party,
  lender: damlTypes.Party,
  auditor: damlTypes.Party,
  invoiceId: string,
  faceValue: damlTypes.Numeric,
  currency: string,
  dueDate: damlTypes.Date,
  advanceRate: damlTypes.Numeric,
  advanceAmount: damlTypes.Numeric,
  yieldBps: damlTypes.Int,
  fundingDate: damlTypes.Date,
}

export declare interface FundedInvoiceInterface {
  Archive: 
    damlTypes.Choice<FundedInvoice, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<FundedInvoice, undefined>>;
}
export declare const FundedInvoice:
  damlTypes.Template<FundedInvoice, undefined, '#daml-main:Invoicing:FundedInvoice'> &
  damlTypes.ToInterface<FundedInvoice, never> &
  FundedInvoiceInterface

export declare type InvoiceDraft = {
  supplier: damlTypes.Party,
  buyer: damlTypes.Party,
  invoiceId: string,
  faceValue: damlTypes.Numeric,
  currency: string,
  dueDate: damlTypes.Date,
  description: string,
}

export declare interface InvoiceDraftInterface {
  Archive: 
    damlTypes.Choice<InvoiceDraft, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<InvoiceDraft, undefined>>;
  InvoiceDraft_Verify: 
    damlTypes.Choice<InvoiceDraft, InvoiceDraft_Verify, pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<damlTypes.ContractId<VerifiedInvoice>, damlTypes.ContractId<PaymentObligation>>, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<InvoiceDraft, undefined>>;
  InvoiceDraft_Withdraw: 
    damlTypes.Choice<InvoiceDraft, InvoiceDraft_Withdraw, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<InvoiceDraft, undefined>>;
}
export declare const InvoiceDraft:
  damlTypes.Template<InvoiceDraft, undefined, '#daml-main:Invoicing:InvoiceDraft'> &
  damlTypes.ToInterface<InvoiceDraft, never> &
  InvoiceDraftInterface

export declare type InvoiceDraft_Verify = {
}

export declare const InvoiceDraft_Verify:
  damlTypes.Serializable<InvoiceDraft_Verify>

export declare type InvoiceDraft_Withdraw = {
}

export declare const InvoiceDraft_Withdraw:
  damlTypes.Serializable<InvoiceDraft_Withdraw>

export declare type PaymentObligation = {
  buyer: damlTypes.Party,
  supplier: damlTypes.Party,
  invoiceId: string,
  faceValue: damlTypes.Numeric,
  currency: string,
  dueDate: damlTypes.Date,
  payee: damlTypes.Party,
}

export declare interface PaymentObligationInterface {
  Archive: 
    damlTypes.Choice<PaymentObligation, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<PaymentObligation, undefined>>;
  PaymentObligation_Settle: 
    damlTypes.Choice<PaymentObligation, PaymentObligation_Settle, damlTypes.ContractId<FundedInvoice>, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<PaymentObligation, undefined>>;
}
export declare const PaymentObligation:
  damlTypes.Template<PaymentObligation, undefined, '#daml-main:Invoicing:PaymentObligation'> &
  damlTypes.ToInterface<PaymentObligation, never> &
  PaymentObligationInterface

export declare type PaymentObligation_Settle = {
  lender: damlTypes.Party,
  auditor: damlTypes.Party,
  advanceRate: damlTypes.Numeric,
  advanceAmount: damlTypes.Numeric,
  yieldBps: damlTypes.Int,
  fundingDate: damlTypes.Date,
}

export declare const PaymentObligation_Settle:
  damlTypes.Serializable<PaymentObligation_Settle>

export declare type Quote = {
  supplier: damlTypes.Party,
  buyer: damlTypes.Party,
  lender: damlTypes.Party,
  invoiceId: string,
  faceValue: damlTypes.Numeric,
  currency: string,
  dueDate: damlTypes.Date,
  advanceRate: damlTypes.Numeric,
  yieldBps: damlTypes.Int,
  fundingDeadline: damlTypes.Date,
  holdingCid: damlTypes.ContractId<pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding>,
  transferFactoryCid: damlTypes.ContractId<pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory>,
  instrumentId: pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.InstrumentId,
  paymentObligationCid: damlTypes.ContractId<PaymentObligation>,
}

export declare interface QuoteInterface {
  Archive: 
    damlTypes.Choice<Quote, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<Quote, undefined>>;
  Quote_Accept: 
    damlTypes.Choice<Quote, Quote_Accept, damlTypes.ContractId<FundedInvoice>, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<Quote, undefined>>;
  Quote_Reject: 
    damlTypes.Choice<Quote, Quote_Reject, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<Quote, undefined>>;
}
export declare const Quote:
  damlTypes.Template<Quote, undefined, '#daml-main:Invoicing:Quote'> &
  damlTypes.ToInterface<Quote, never> &
  QuoteInterface

export declare type Quote_Accept = {
  auditor: damlTypes.Party,
  fundingDate: damlTypes.Date,
  remainingInvitationCids: string[],
}

export declare const Quote_Accept:
  damlTypes.Serializable<Quote_Accept>

export declare type Quote_Reject = {
}

export declare const Quote_Reject:
  damlTypes.Serializable<Quote_Reject>

export declare type VerifiedInvoice = {
  supplier: damlTypes.Party,
  buyer: damlTypes.Party,
  invoiceId: string,
  faceValue: damlTypes.Numeric,
  currency: string,
  dueDate: damlTypes.Date,
  description: string,
}

export declare interface VerifiedInvoiceInterface {
  Archive: 
    damlTypes.Choice<VerifiedInvoice, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<VerifiedInvoice, undefined>>;
  VerifiedInvoice_OpenForFinancing: 
    damlTypes.Choice<VerifiedInvoice, VerifiedInvoice_OpenForFinancing, damlTypes.ContractId<FinancingInvitation>[], undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<VerifiedInvoice, undefined>>;
}
export declare const VerifiedInvoice:
  damlTypes.Template<VerifiedInvoice, undefined, '#daml-main:Invoicing:VerifiedInvoice'> &
  damlTypes.ToInterface<VerifiedInvoice, never> &
  VerifiedInvoiceInterface

export declare type VerifiedInvoice_OpenForFinancing = {
  lenders: damlTypes.Party[],
  maxAdvanceRate: damlTypes.Numeric,
  biddingDeadline: damlTypes.Date,
  paymentObligationCid: damlTypes.ContractId<PaymentObligation>,
}

export declare const VerifiedInvoice_OpenForFinancing:
  damlTypes.Serializable<VerifiedInvoice_OpenForFinancing>
