import { CoreSchema } from '@schema/core';

export interface NotificationRequestPK extends CoreSchema.ResourceKey<'notification_request'> {
  notificationRequestId: string;
}
