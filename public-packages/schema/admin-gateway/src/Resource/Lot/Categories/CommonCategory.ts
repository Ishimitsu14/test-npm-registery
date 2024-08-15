import { MergeAttributes } from '@schema/core';

import { LotAttributes } from '../Attributes';
import { LotInputs } from '../Inputs';

export namespace CommonCategory {
  export type InputObject = MergeAttributes<
    [
      LotInputs.COMMON_BID_MAKER_TYPES,
      LotInputs.COMMON_DEADLINE,
      LotInputs.COMMON_DIRECTION,
      LotInputs.COMMON_IS_DIRECT,
      LotInputs.COMMON_MIN_FILTER_UNITS,
      LotInputs.COMMON_MIN_FILTER_SUMMARY,
      LotInputs.COMMON_OFFER_MAKER_TYPES,
      LotInputs.COMMON_PRICE,
      LotInputs.COMMON_SUMMARY,
      LotInputs.COMMON_TELEGRAM,
      LotInputs.COMMON_UNITS,
      LotInputs.COMMON_ADDITIONAL_INFO,
      LotInputs.COMMON_BADGE,
    ]
  >;

  export type AttributeObject = MergeAttributes<
    [
      InputObject,

      LotAttributes.COMMON_MEDIATOR,
      LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE,
      LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE,
      LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE,
      LotAttributes.COMMON_CREATED_AT_ATTRIBUTE,
      LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE,
      LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE,
      LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE,
      LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE,
    ]
  >;
}
