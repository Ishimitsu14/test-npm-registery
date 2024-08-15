import { CoreSchema } from '@schema/core';

export interface NotificationKey extends CoreSchema.ResourceKey<'notification'> {
  notificationId: string;
}
