import { MergeAttributes } from '@schema/core';

import { LotInputs } from '../Inputs';
import { CommonCategory } from './CommonCategory';

export namespace InvestDocumentCategory {
  export type InputObject = MergeAttributes<
    [
      CommonCategory.InputObject,

      LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST,
      LotInputs.INVEST_DOC_ASSET_PK,
      LotInputs.INVEST_DOC_FDV,
      LotInputs.INVEST_DOC_ROUND_FDV,
      LotInputs.INVEST_DOC_ROUND_PRICE,
      LotInputs.INVEST_DOC_ROUND_SHARE,
      LotInputs.INVEST_DOC_ROUND_SUMMARY,
      LotInputs.INVEST_DOC_ROUND_TYPE,
      LotInputs.INVEST_DOC_ROUND_UNITS,
      LotInputs.INVEST_DOC_SHARE,
      LotInputs.INVEST_DOC_REASSIGNMENT_TYPE,
    ]
  >;

  export type AttributeObject = MergeAttributes<[CommonCategory.AttributeObject, InputObject]>;
}
