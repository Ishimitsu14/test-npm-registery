import { CoreSchema } from '@schema/core';

import { NotificationRecipientPK } from '../NotificationConfig';
import { NotificationRequestPK } from '../NotificationRequest';

export interface NotificationPK extends CoreSchema.ResourceKey<'notification'> {
  notificationRequestKey: NotificationRequestPK;
  recipientKey: NotificationRecipientPK;
}
