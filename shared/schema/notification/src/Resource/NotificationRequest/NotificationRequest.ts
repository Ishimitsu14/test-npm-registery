import { CoreSchema } from '@schema/core';

import { NotificationType } from '../Notification';
import { NotificationPayload } from '../Notification/NotificationPayload';
import { NotificationRecipientPK } from '../NotificationConfig';
import { NotificationRecipientType } from './Enums';
import { NotificationRequestPK } from './NotificationRequestPK';

export interface NotificationRequest<Type extends NotificationType = NotificationType> extends CoreSchema.Resource<'notification_request', NotificationRequestPK> {
  createdAt: number;
  type: Type;
  recipientType: NotificationRecipientType;
  recipients: NotificationRecipientPK[];
  payload: NotificationPayload<Type>;
}
