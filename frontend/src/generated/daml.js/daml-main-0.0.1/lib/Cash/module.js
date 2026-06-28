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

var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');

exports.CashHolding = damlTypes.assembleTemplate(
  {
    templateId: '#daml-main:Cash:CashHolding',
    templateIdWithPackageId: '#99b3cc93ecddbdd6a395713261aca019b4e2599de239c61351c825a7f40bf34b:Cash:CashHolding',
    keyDecoder: jtv.constant(undefined),
    keyEncode: function () { throw 'EncodeError'; },
    decoder: damlTypes.lazyMemo(function () {
      return jtv.object({
        owner: damlTypes.Party.decoder,
        currency: damlTypes.Text.decoder,
        amount: damlTypes.Numeric(10).decoder,
      });
    }),
    encode: function (__typed__) {
      return {
        owner: damlTypes.Party.encode(__typed__.owner),
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
);

damlTypes.registerTemplate(exports.CashHolding, ['99b3cc93ecddbdd6a395713261aca019b4e2599de239c61351c825a7f40bf34b', '#daml-main']);
