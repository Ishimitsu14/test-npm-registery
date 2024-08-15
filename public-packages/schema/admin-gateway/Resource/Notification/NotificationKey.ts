import { CoreSchema } from '../../../core';

export interface NotificationKey extends CoreSchema.ResourceKey<'notification'> {
  notificationId: string;
}
