import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

import { NotificationRecipientPK } from '../NotificationRecipientPK';
import { NotificationRequestPK } from '../NotificationRequest';

export class NotificationPK extends EntityKey {
  static create(recipientPK: NotificationRecipientPK, notificationRequestPK: NotificationRequestPK) {
    return new NotificationPK(recipientPK, notificationRequestPK);
  }

  static fromSnapshot(recipientPK: NotificationRecipientPK, notificationRequestPK: NotificationRequestPK) {
    return new NotificationPK(recipientPK, notificationRequestPK);
  }

  private constructor(
    readonly recipientPK: NotificationRecipientPK,
    readonly notificationRequestPK: NotificationRequestPK,
  ) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return {
      recipientPK: this.recipientPK,
      notificationRequestPK: this.notificationRequestPK,
    };
  }
}
