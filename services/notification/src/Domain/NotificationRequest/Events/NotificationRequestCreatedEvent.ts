import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { NotificationRequest } from '../NotificationRequest';

export class NotificationRequestCreatedEvent extends AbstractDomainEvent {
  constructor(readonly notificationRequest: NotificationRequest) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { notificationRequest: this.notificationRequest };
  }
}
