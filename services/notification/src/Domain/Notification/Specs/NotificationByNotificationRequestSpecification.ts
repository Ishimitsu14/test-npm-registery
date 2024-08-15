import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { NotificationRequest } from '../../NotificationRequest';
import { Notification } from '../Notification';

export class NotificationByNotificationRequestSpecification extends Specification<Notification> {
  constructor(readonly notificationRequests: NotificationRequest[] | Specification<NotificationRequest>) {
    super();

    if (Specification.isExtends(notificationRequests)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(notificationRequests)) {
      this.addFilter((notification) => {
        return notificationRequests.some((notificationRequest) => {
          return notification.primaryKey.notificationRequestPK.isEquals(notificationRequest.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { notificationRequests: this.notificationRequests };
  }
}
