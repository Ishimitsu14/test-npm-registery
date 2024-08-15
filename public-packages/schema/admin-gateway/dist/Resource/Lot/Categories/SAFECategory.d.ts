import { MergeAttributes } from '@schema/core';
import { LotInputs } from '../Inputs';
import { InvestDocumentCategory } from './InvestDocumentCategory';
export declare namespace SAFECategory {
    type InputObject = MergeAttributes<[InvestDocumentCategory.InputObject, LotInputs.SAFE_WITH_TOKEN_WARRANT]>;
    type AttributeObject = MergeAttributes<[InvestDocumentCategory.AttributeObject, InputObject]>;
}
