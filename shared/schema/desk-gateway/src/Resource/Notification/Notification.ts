import { CoreSchema } from '@schema/core';

import { NotificationType } from './Enums';
import { NotificationKey } from './NotificationKey';
import { NotificationPayload } from './NotificationPayload';

export interface Notification<Type extends NotificationType = NotificationType> extends CoreSchema.Resource<'notification', NotificationKey> {
  type: Type;
  createdAt: number;
  payload: NotificationPayload<Type>;
  isReaded: boolean;
}
