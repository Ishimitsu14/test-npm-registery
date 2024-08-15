import { LotManagementSchema } from '@schema/lot-management';
import { UserIdentitySchema } from '@schema/user-identity';

import { NotificationType } from './Enums';

export type NotificationPayload<Type extends NotificationType> = NotificationPayloadMap[Type];

export interface NotificationPayloadMap {
  SYSTEM_INFO: {
    text: string;
  };
  DEAL_CREATED: {
    deal: LotManagementSchema.Deal;
  };
  DEAL_STATUS_CHANGED: {
    deal: LotManagementSchema.Deal;
  };
  LOT_CREATED: {
    lot: LotManagementSchema.Lot;
  };
  LOT_STATUS_CHANGED: {
    lot: LotManagementSchema.Lot;
  };
  BID_RECEIVED: {
    bid: LotManagementSchema.Bid;
  };
  BID_STATUS_CHANGED: {
    bid: LotManagementSchema.Bid;
  };
  USER_REGISTERED: {
    user: UserIdentitySchema.User;
  };
  USER_PROFILE_CHANGED: {
    user: UserIdentitySchema.User;
  };
  LOT_QUESTION_RECEIVED: {
    lotQuestion: LotManagementSchema.LotQuestion;
  };
  LOT_QUESTION_PUBLISHED: {
    lotQuestion: LotManagementSchema.LotQuestion;
  };
}
