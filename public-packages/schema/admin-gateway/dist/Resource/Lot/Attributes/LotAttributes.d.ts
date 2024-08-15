import { Attribute } from '@schema/core';
import { MediatorType } from '../../Common';
import { LotCompletedReasonType } from '../Enums';
export declare namespace LotAttributes {
    type COMMON_CREATED_AT_ATTRIBUTE = Attribute<'COMMON_CREATED_AT_ATTRIBUTE', number>;
    type COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE = Attribute<'COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE', number>;
    type COMMON_PUBLISHED_AT_ATTRIBUTE = Attribute<'COMMON_PUBLISHED_AT_ATTRIBUTE', number>;
    type COMMON_ARCHIVED_AT_ATTRIBUTE = Attribute<'COMMON_ARCHIVED_AT_ATTRIBUTE', number>;
    type COMMON_COMPLETED_AT_ATTRIBUTE = Attribute<'COMMON_COMPLETED_AT_ATTRIBUTE', number>;
    type COMMON_COMPLETED_REASON_ATTRIBUTE = Attribute<'COMMON_COMPLETED_REASON_ATTRIBUTE', LotCompletedReasonType>;
    type COMMON_REJECTED_AT_ATTRIBUTE = Attribute<'COMMON_REJECTED_AT_ATTRIBUTE', number>;
    type COMMON_REJECT_REASON_ATTRIBUTE = Attribute<'COMMON_REJECT_REASON_ATTRIBUTE', string>;
    type COMMON_MEDIATOR = Attribute<'COMMON_MEDIATOR', MediatorType>;
}
