import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { Notification } from '../Notification';

export class NotificationByIsReadedSpecification extends Specification<Notification> {
  constructor(readonly isReaded: boolean) {
    super();

    this.addFilter((notificationOwnerInfo) => {
      return notificationOwnerInfo.isReaded === isReaded;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { isReaded: this.isReaded };
  }
}
