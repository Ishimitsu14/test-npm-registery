import { MergeAttributes } from '../../../core';
import { LotInputs } from '../Inputs';
import { InvestDocumentCategory } from './InvestDocumentCategory';

export namespace SAFECategory {
  export type InputObject = MergeAttributes<[InvestDocumentCategory.InputObject, LotInputs.SAFE_WITH_TOKEN_WARRANT]>;
  export type AttributeObject = MergeAttributes<[InvestDocumentCategory.AttributeObject, InputObject]>;
}
