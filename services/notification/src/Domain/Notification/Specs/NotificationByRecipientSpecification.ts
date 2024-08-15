import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { NotificationRecipientPK } from '../../NotificationRecipientPK';
import { Notification } from '../Notification';

export class NotificationByRecipientSpecification extends Specification<Notification> {
  readonly recipients: NotificationRecipientPK[];

  constructor(recipients: NotificationRecipientPK | NotificationRecipientPK[]) {
    super();

    this.recipients = Array.isArray(recipients) ? recipients : [recipients];

    this.addFilter((notification) => NullableObject.hasValue(this.recipients.find((m) => m.isEquals(notification.primaryKey.recipientPK))));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { recipients: this.recipients };
  }
}
