import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { NotificationType } from '../../Notification';
import { NotificationRequest } from '../NotificationRequest';

export class NotificationRequestByTypeSpecification extends Specification<NotificationRequest> {
  readonly type: NotificationType[];

  constructor(type: NotificationType | NotificationType[]) {
    super();

    this.type = Array.isArray(type) ? type : [type];

    this.addFilter((notification) => {
      return this.type.some((m) => m.isEquals(notification.type));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { type: this.type };
  }
}
