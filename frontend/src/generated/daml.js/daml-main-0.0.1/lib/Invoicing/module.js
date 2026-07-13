"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });

/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');

var pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281 = require('@daml.js/splice-api-token-transfer-instruction-v1-1.0.0');
var pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 = require('@daml.js/daml-prim-DA-Types-1.0.0');
var pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b = require('@daml.js/splice-api-token-holding-v1-1.0.0');
var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');

exports.FinancingInvitation = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Invoicing:FinancingInvitation',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Invoicing:FinancingInvitation',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        supplier: damlTypes.Party.decoder,
        buyer: damlTypes.Party.decoder,
        lender: damlTypes.Party.decoder,
        invoiceId: damlTypes.Text.decoder,
        faceValue: damlTypes.Numeric(10).decoder,
        currency: damlTypes.Text.decoder,
        dueDate: damlTypes.Date.decoder,
        description: damlTypes.Text.decoder,
        maxAdvanceRate: damlTypes.Numeric(10).decoder,
        biddingDeadline: damlTypes.Date.decoder,
        paymentObligationCid: damlTypes.ContractId(exports.PaymentObligation).decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        supplier: damlTypes.Party.encode(__typed__.supplier),
        buyer: damlTypes.Party.encode(__typed__.buyer),
        lender: damlTypes.Party.encode(__typed__.lender),
        invoiceId: damlTypes.Text.encode(__typed__.invoiceId),
        faceValue: damlTypes.Numeric(10).encode(__typed__.faceValue),
        currency: damlTypes.Text.encode(__typed__.currency),
        dueDate: damlTypes.Date.encode(__typed__.dueDate),
        description: damlTypes.Text.encode(__typed__.description),
        maxAdvanceRate: damlTypes.Numeric(10).encode(__typed__.maxAdvanceRate),
        biddingDeadline: damlTypes.Date.encode(__typed__.biddingDeadline),
        paymentObligationCid: damlTypes.ContractId(exports.PaymentObligation).encode(__typed__.paymentObligationCid),
      };
    },
    Archive: {
      template: function () { return exports.FinancingInvitation; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder;
      }),
      argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
    FinancingInvitation_Decline: {
      template: function () { return exports.FinancingInvitation; },
      choiceName: 'FinancingInvitation_Decline',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.FinancingInvitation_Decline.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.FinancingInvitation_Decline.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
    FinancingInvitation_SubmitQuote: {
      template: function () { return exports.FinancingInvitation; },
      choiceName: 'FinancingInvitation_SubmitQuote',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.FinancingInvitation_SubmitQuote.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.FinancingInvitation_SubmitQuote.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.ContractId(exports.Quote).decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Quote).encode(__typed__); },
    },
  },
);

damlTypes.registerTemplate(exports.FinancingInvitation, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.FinancingInvitation_Decline = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
    });
  }),
  encode: function (__typed__) {
    return {};
  },
};

exports.FinancingInvitation_SubmitQuote = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
      advanceRate: damlTypes.Numeric(10).decoder,
      yieldBps: damlTypes.Int.decoder,
      fundingDeadline: damlTypes.Date.decoder,
      holdingCid: damlTypes.ContractId(pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding).decoder,
      transferFactoryCid: damlTypes.ContractId(pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory).decoder,
      instrumentId: pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.InstrumentId.decoder,
    });
  }),
  encode: function (__typed__) {
    return {
      advanceRate: damlTypes.Numeric(10).encode(__typed__.advanceRate),
      yieldBps: damlTypes.Int.encode(__typed__.yieldBps),
      fundingDeadline: damlTypes.Date.encode(__typed__.fundingDeadline),
      holdingCid: damlTypes.ContractId(pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding).encode(__typed__.holdingCid),
      transferFactoryCid: damlTypes.ContractId(pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory).encode(__typed__.transferFactoryCid),
      instrumentId: pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.InstrumentId.encode(__typed__.instrumentId),
    };
  },
};

exports.FundedInvoice = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Invoicing:FundedInvoice',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Invoicing:FundedInvoice',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        supplier: damlTypes.Party.decoder,
        buyer: damlTypes.Party.decoder,
        lender: damlTypes.Party.decoder,
        auditor: damlTypes.Party.decoder,
        invoiceId: damlTypes.Text.decoder,
        faceValue: damlTypes.Numeric(10).decoder,
        currency: damlTypes.Text.decoder,
        dueDate: damlTypes.Date.decoder,
        advanceRate: damlTypes.Numeric(10).decoder,
        advanceAmount: damlTypes.Numeric(10).decoder,
        yieldBps: damlTypes.Int.decoder,
        fundingDate: damlTypes.Date.decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        supplier: damlTypes.Party.encode(__typed__.supplier),
        buyer: damlTypes.Party.encode(__typed__.buyer),
        lender: damlTypes.Party.encode(__typed__.lender),
        auditor: damlTypes.Party.encode(__typed__.auditor),
        invoiceId: damlTypes.Text.encode(__typed__.invoiceId),
        faceValue: damlTypes.Numeric(10).encode(__typed__.faceValue),
        currency: damlTypes.Text.encode(__typed__.currency),
        dueDate: damlTypes.Date.encode(__typed__.dueDate),
        advanceRate: damlTypes.Numeric(10).encode(__typed__.advanceRate),
        advanceAmount: damlTypes.Numeric(10).encode(__typed__.advanceAmount),
        yieldBps: damlTypes.Int.encode(__typed__.yieldBps),
        fundingDate: damlTypes.Date.encode(__typed__.fundingDate),
      };
    },
    Archive: {
      template: function () { return exports.FundedInvoice; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder;
      }),
      argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
  },
);

damlTypes.registerTemplate(exports.FundedInvoice, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.InvoiceDraft = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Invoicing:InvoiceDraft',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Invoicing:InvoiceDraft',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        supplier: damlTypes.Party.decoder,
        buyer: damlTypes.Party.decoder,
        invoiceId: damlTypes.Text.decoder,
        faceValue: damlTypes.Numeric(10).decoder,
        currency: damlTypes.Text.decoder,
        dueDate: damlTypes.Date.decoder,
        description: damlTypes.Text.decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        supplier: damlTypes.Party.encode(__typed__.supplier),
        buyer: damlTypes.Party.encode(__typed__.buyer),
        invoiceId: damlTypes.Text.encode(__typed__.invoiceId),
        faceValue: damlTypes.Numeric(10).encode(__typed__.faceValue),
        currency: damlTypes.Text.encode(__typed__.currency),
        dueDate: damlTypes.Date.encode(__typed__.dueDate),
        description: damlTypes.Text.encode(__typed__.description),
      };
    },
    Archive: {
      template: function () { return exports.InvoiceDraft; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder;
      }),
      argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
    InvoiceDraft_Verify: {
      template: function () { return exports.InvoiceDraft; },
      choiceName: 'InvoiceDraft_Verify',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.InvoiceDraft_Verify.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.InvoiceDraft_Verify.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.ContractId(exports.VerifiedInvoice), damlTypes.ContractId(exports.PaymentObligation)).decoder;
      }),
      resultEncode: function (__typed__) { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.ContractId(exports.VerifiedInvoice), damlTypes.ContractId(exports.PaymentObligation)).encode(__typed__); },
    },
    InvoiceDraft_Withdraw: {
      template: function () { return exports.InvoiceDraft; },
      choiceName: 'InvoiceDraft_Withdraw',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.InvoiceDraft_Withdraw.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.InvoiceDraft_Withdraw.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
  },
);

damlTypes.registerTemplate(exports.InvoiceDraft, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.InvoiceDraft_Verify = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
    });
  }),
  encode: function (__typed__) {
    return {};
  },
};

exports.InvoiceDraft_Withdraw = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
    });
  }),
  encode: function (__typed__) {
    return {};
  },
};

exports.PaymentObligation = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Invoicing:PaymentObligation',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Invoicing:PaymentObligation',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        buyer: damlTypes.Party.decoder,
        supplier: damlTypes.Party.decoder,
        invoiceId: damlTypes.Text.decoder,
        faceValue: damlTypes.Numeric(10).decoder,
        currency: damlTypes.Text.decoder,
        dueDate: damlTypes.Date.decoder,
        payee: damlTypes.Party.decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        buyer: damlTypes.Party.encode(__typed__.buyer),
        supplier: damlTypes.Party.encode(__typed__.supplier),
        invoiceId: damlTypes.Text.encode(__typed__.invoiceId),
        faceValue: damlTypes.Numeric(10).encode(__typed__.faceValue),
        currency: damlTypes.Text.encode(__typed__.currency),
        dueDate: damlTypes.Date.encode(__typed__.dueDate),
        payee: damlTypes.Party.encode(__typed__.payee),
      };
    },
    Archive: {
      template: function () { return exports.PaymentObligation; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder;
      }),
      argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
    PaymentObligation_Settle: {
      template: function () { return exports.PaymentObligation; },
      choiceName: 'PaymentObligation_Settle',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.PaymentObligation_Settle.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.PaymentObligation_Settle.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.ContractId(exports.FundedInvoice).decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FundedInvoice).encode(__typed__); },
    },
  },
);

damlTypes.registerTemplate(exports.PaymentObligation, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.PaymentObligation_Settle = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
      lender: damlTypes.Party.decoder,
      auditor: damlTypes.Party.decoder,
      advanceRate: damlTypes.Numeric(10).decoder,
      advanceAmount: damlTypes.Numeric(10).decoder,
      yieldBps: damlTypes.Int.decoder,
      fundingDate: damlTypes.Date.decoder,
    });
  }),
  encode: function (__typed__) {
    return {
      lender: damlTypes.Party.encode(__typed__.lender),
      auditor: damlTypes.Party.encode(__typed__.auditor),
      advanceRate: damlTypes.Numeric(10).encode(__typed__.advanceRate),
      advanceAmount: damlTypes.Numeric(10).encode(__typed__.advanceAmount),
      yieldBps: damlTypes.Int.encode(__typed__.yieldBps),
      fundingDate: damlTypes.Date.encode(__typed__.fundingDate),
    };
  },
};

exports.Quote = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Invoicing:Quote',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Invoicing:Quote',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        supplier: damlTypes.Party.decoder,
        buyer: damlTypes.Party.decoder,
        lender: damlTypes.Party.decoder,
        invoiceId: damlTypes.Text.decoder,
        faceValue: damlTypes.Numeric(10).decoder,
        currency: damlTypes.Text.decoder,
        dueDate: damlTypes.Date.decoder,
        advanceRate: damlTypes.Numeric(10).decoder,
        yieldBps: damlTypes.Int.decoder,
        fundingDeadline: damlTypes.Date.decoder,
        holdingCid: damlTypes.ContractId(pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding).decoder,
        transferFactoryCid: damlTypes.ContractId(pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory).decoder,
        instrumentId: pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.InstrumentId.decoder,
        paymentObligationCid: damlTypes.ContractId(exports.PaymentObligation).decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        supplier: damlTypes.Party.encode(__typed__.supplier),
        buyer: damlTypes.Party.encode(__typed__.buyer),
        lender: damlTypes.Party.encode(__typed__.lender),
        invoiceId: damlTypes.Text.encode(__typed__.invoiceId),
        faceValue: damlTypes.Numeric(10).encode(__typed__.faceValue),
        currency: damlTypes.Text.encode(__typed__.currency),
        dueDate: damlTypes.Date.encode(__typed__.dueDate),
        advanceRate: damlTypes.Numeric(10).encode(__typed__.advanceRate),
        yieldBps: damlTypes.Int.encode(__typed__.yieldBps),
        fundingDeadline: damlTypes.Date.encode(__typed__.fundingDeadline),
        holdingCid: damlTypes.ContractId(pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding).encode(__typed__.holdingCid),
        transferFactoryCid: damlTypes.ContractId(pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory).encode(__typed__.transferFactoryCid),
        instrumentId: pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.InstrumentId.encode(__typed__.instrumentId),
        paymentObligationCid: damlTypes.ContractId(exports.PaymentObligation).encode(__typed__.paymentObligationCid),
      };
    },
    Archive: {
      template: function () { return exports.Quote; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder;
      }),
      argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
    Quote_Accept: {
      template: function () { return exports.Quote; },
      choiceName: 'Quote_Accept',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.Quote_Accept.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.Quote_Accept.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.ContractId(exports.FundedInvoice).decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FundedInvoice).encode(__typed__); },
    },
    Quote_Reject: {
      template: function () { return exports.Quote; },
      choiceName: 'Quote_Reject',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.Quote_Reject.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.Quote_Reject.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
  },
);

damlTypes.registerTemplate(exports.Quote, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.Quote_Accept = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
      auditor: damlTypes.Party.decoder,
      fundingDate: damlTypes.Date.decoder,
    });
  }),
  encode: function (__typed__) {
    return {
      auditor: damlTypes.Party.encode(__typed__.auditor),
      fundingDate: damlTypes.Date.encode(__typed__.fundingDate),
    };
  },
};

exports.Quote_Reject = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
    });
  }),
  encode: function (__typed__) {
    return {};
  },
};

exports.VerifiedInvoice = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Invoicing:VerifiedInvoice',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Invoicing:VerifiedInvoice',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        supplier: damlTypes.Party.decoder,
        buyer: damlTypes.Party.decoder,
        invoiceId: damlTypes.Text.decoder,
        faceValue: damlTypes.Numeric(10).decoder,
        currency: damlTypes.Text.decoder,
        dueDate: damlTypes.Date.decoder,
        description: damlTypes.Text.decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        supplier: damlTypes.Party.encode(__typed__.supplier),
        buyer: damlTypes.Party.encode(__typed__.buyer),
        invoiceId: damlTypes.Text.encode(__typed__.invoiceId),
        faceValue: damlTypes.Numeric(10).encode(__typed__.faceValue),
        currency: damlTypes.Text.encode(__typed__.currency),
        dueDate: damlTypes.Date.encode(__typed__.dueDate),
        description: damlTypes.Text.encode(__typed__.description),
      };
    },
    Archive: {
      template: function () { return exports.VerifiedInvoice; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder;
      }),
      argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.Unit.decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
    VerifiedInvoice_OpenForFinancing: {
      template: function () { return exports.VerifiedInvoice; },
      choiceName: 'VerifiedInvoice_OpenForFinancing',
      argumentDecoder: damlTypes.lazyMemo(function () {
        return exports.VerifiedInvoice_OpenForFinancing.decoder;
      }),
      argumentEncode: function (__typed__) { return exports.VerifiedInvoice_OpenForFinancing.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () {
        return damlTypes.List(damlTypes.ContractId(exports.FinancingInvitation)).decoder;
      }),
      resultEncode: function (__typed__) { return damlTypes.List(damlTypes.ContractId(exports.FinancingInvitation)).encode(__typed__); },
    },
  },
);

damlTypes.registerTemplate(exports.VerifiedInvoice, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.VerifiedInvoice_OpenForFinancing = {
  decoder: damlTypes.lazyMemo(function () {
    return jtv.object({
      lenders: damlTypes.List(damlTypes.Party).decoder,
      maxAdvanceRate: damlTypes.Numeric(10).decoder,
      biddingDeadline: damlTypes.Date.decoder,
      paymentObligationCid: damlTypes.ContractId(exports.PaymentObligation).decoder,
    });
  }),
  encode: function (__typed__) {
    return {
      lenders: damlTypes.List(damlTypes.Party).encode(__typed__.lenders),
      maxAdvanceRate: damlTypes.Numeric(10).encode(__typed__.maxAdvanceRate),
      biddingDeadline: damlTypes.Date.encode(__typed__.biddingDeadline),
      paymentObligationCid: damlTypes.ContractId(exports.PaymentObligation).encode(__typed__.paymentObligationCid),
    };
  },
};
