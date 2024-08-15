import { LotBadge } from '../../LotBadge';
import { Attribute } from '../Abstract';
import { LotCompletedReasonType, LotRejectReason } from '../Enums';

export namespace LotAttributes {
  export const COMMON_CREATED_AT_ATTRIBUTE = Attribute.create<Date>('COMMON_CREATED_AT_ATTRIBUTE');
  export const COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE = Attribute.create<Date>('COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE');
  export const COMMON_PUBLISHED_AT_ATTRIBUTE = Attribute.create<Date>('COMMON_PUBLISHED_AT_ATTRIBUTE');
  export const COMMON_COMPLETED_AT_ATTRIBUTE = Attribute.create<Date>('COMMON_COMPLETED_AT_ATTRIBUTE');
  export const COMMON_COMPLETED_REASON_ATTRIBUTE = Attribute.create<LotCompletedReasonType>('COMMON_COMPLETED_REASON_ATTRIBUTE');
  export const COMMON_REJECTED_AT_ATTRIBUTE = Attribute.create<Date>('COMMON_REJECTED_AT_ATTRIBUTE');
  export const COMMON_REJECT_REASON_ATTRIBUTE = Attribute.create<LotRejectReason>('COMMON_REJECT_REASON_ATTRIBUTE');
  export const COMMON_ARCHIVED_AT_ATTRIBUTE = Attribute.create<Date>('COMMON_ARCHIVED_AT_ATTRIBUTE');
  export const COMMON_BADGE_ATTRIBUTE = Attribute.create<LotBadge>('COMMON_BADGE_ATTRIBUTE');
}
