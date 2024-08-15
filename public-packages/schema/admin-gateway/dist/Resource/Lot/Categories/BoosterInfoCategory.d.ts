import { MergeAttributes } from '@schema/core';
import { LotInputs } from '../Inputs';
export declare namespace BoosterInfoCategory {
    type InputObject = MergeAttributes<[
        LotInputs.BOOSTER_INFO_ROUND_TYPE,
        LotInputs.BOOSTER_INFO_FDV,
        LotInputs.BOOSTER_INFO_ROUND_PRICE,
        LotInputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE,
        LotInputs.BOOSTER_INFO_FUTURE_ROUND_PRICE,
        LotInputs.BOOSTER_INFO_LISTING_TIMELINE,
        LotInputs.BOOSTER_INFO_ADDITIONAL_INFO
    ]>;
}
