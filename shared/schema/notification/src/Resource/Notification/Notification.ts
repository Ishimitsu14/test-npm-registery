import * as SchemaCommon from '@schema/core';

import { NotificationType } from './Enums';
import { NotificationPayload } from './NotificationPayload';
import { NotificationPK } from './NotificationPK';

export interface Notification<Type extends NotificationType = NotificationType> extends SchemaCommon.Resource<'notification', NotificationPK> {
  type: Type;
  createdAt: number;
  payload: NotificationPayload<Type>;
  isReaded: boolean;
}
