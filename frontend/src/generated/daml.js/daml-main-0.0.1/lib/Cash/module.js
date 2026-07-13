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
var pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b = require('@daml.js/splice-api-token-holding-v1-1.0.0');
var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');

exports.CashHolding = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Cash:CashHolding',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Cash:CashHolding',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        owner: damlTypes.Party.decoder,
        admin: damlTypes.Party.decoder,
        currency: damlTypes.Text.decoder,
        amount: damlTypes.Numeric(10).decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        owner: damlTypes.Party.encode(__typed__.owner),
        admin: damlTypes.Party.encode(__typed__.admin),
        currency: damlTypes.Text.encode(__typed__.currency),
        amount: damlTypes.Numeric(10).encode(__typed__.amount),
      };
    },
    Archive: {
      template: function () { return exports.CashHolding; },
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
  pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding,
);

damlTypes.registerTemplate(exports.CashHolding, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);

exports.CcxTransferFactory = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Cash:CcxTransferFactory',
    templateIdWithPackageId: '#e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02:Cash:CcxTransferFactory',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        admin: damlTypes.Party.decoder,
        observers: damlTypes.List(damlTypes.Party).decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        admin: damlTypes.Party.encode(__typed__.admin),
        observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
      };
    },
    Archive: {
      template: function () { return exports.CcxTransferFactory; },
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
  pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory,
);

damlTypes.registerTemplate(exports.CcxTransferFactory, ['e075b7559cd6e27ea3e7d66c386fbf6194d344756c85e04a1380e5f759470a02', '#daml-main']);
