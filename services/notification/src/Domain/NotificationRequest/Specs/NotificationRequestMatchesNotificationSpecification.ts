import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Notification } from '../../Notification';
import { NotificationRequest } from '../NotificationRequest';

export class NotificationRequestMatchesNotificationSpecification extends Specification<NotificationRequest> {
  constructor(readonly notifications: Notification[] | Specification<Notification>) {
    super();

    if (Specification.isExtends(notifications)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(notifications)) {
      this.addFilter((notificationRequest) => {
        return notifications.some((notification) => {
          return notification.primaryKey.notificationRequestPK.isEquals(notificationRequest.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { notifications: this.notifications };
  }
}
