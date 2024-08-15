import { MergeAttributes } from '../../../core';
import { LotInputs } from '../Inputs';
import { InvestDocumentCategory } from './InvestDocumentCategory';

export namespace TokenWarrantCategory {
  export type InputObject = MergeAttributes<[InvestDocumentCategory.InputObject, LotInputs.TOKEN_TGE, LotInputs.TOKEN_LOCKUP_PERIOD, LotInputs.TOKEN_VESTING_PERIOD]>;

  export type AttributeObject = MergeAttributes<[InvestDocumentCategory.AttributeObject, InputObject]>;
}
