import { MergeAttributes } from '@schema/core';
import { LotInputs } from '../Inputs';
import { InvestDocumentCategory } from './InvestDocumentCategory';
export declare namespace SAFTCategory {
    type InputObject = MergeAttributes<[InvestDocumentCategory.InputObject, LotInputs.TOKEN_TGE, LotInputs.TOKEN_LOCKUP_PERIOD, LotInputs.TOKEN_VESTING_PERIOD]>;
    type AttributeObject = MergeAttributes<[InvestDocumentCategory.AttributeObject, InputObject]>;
}
