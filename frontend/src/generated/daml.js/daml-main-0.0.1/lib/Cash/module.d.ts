// Generated from ../Cash/module.daml

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281 from '@daml.js/splice-api-token-transfer-instruction-v1-1.0.0';
import * as pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b from '@daml.js/splice-api-token-holding-v1-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type CashHolding = {
  owner: damlTypes.Party,
  admin: damlTypes.Party,
  currency: string,
  amount: damlTypes.Numeric,
}

export declare interface CashHoldingInterface {
  Archive: 
    damlTypes.Choice<CashHolding, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<CashHolding, undefined>>;
}
export declare const CashHolding:
  damlTypes.Template<CashHolding, undefined, '#daml-main:Cash:CashHolding'> &
  damlTypes.ToInterface<CashHolding, pkg718a0f77e505a8de22f188bd4c87fe74101274e9d4cb1bfac7d09aec7158d35b.Splice.Api.Token.HoldingV1.Holding> &
  CashHoldingInterface

export declare type CcxTransferFactory = {
  admin: damlTypes.Party,
  observers: damlTypes.Party[],
}

export declare interface CcxTransferFactoryInterface {
  Archive: 
    damlTypes.Choice<CcxTransferFactory, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> &
    damlTypes.ChoiceFrom<damlTypes.Template<CcxTransferFactory, undefined>>;
}
export declare const CcxTransferFactory:
  damlTypes.Template<CcxTransferFactory, undefined, '#daml-main:Cash:CcxTransferFactory'> &
  damlTypes.ToInterface<CcxTransferFactory, pkg55ba4deb0ad4662c4168b39859738a0e91388d252286480c7331b3f71a517281.Splice.Api.Token.TransferInstructionV1.TransferFactory> &
  CcxTransferFactoryInterface
