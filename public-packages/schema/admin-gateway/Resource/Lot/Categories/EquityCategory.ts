import { MergeAttributes } from '../../../core';
import { InvestDocumentCategory } from './InvestDocumentCategory';

export namespace EquityCategory {
  export type InputObject = MergeAttributes<[InvestDocumentCategory.InputObject]>;
  export type AttributeObject = MergeAttributes<[InvestDocumentCategory.AttributeObject]>;
}
