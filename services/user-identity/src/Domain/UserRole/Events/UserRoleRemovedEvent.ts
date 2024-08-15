import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { UserRole } from '../UserRole';

export class UserRoleRemovedEvent extends AbstractDomainEvent {
  constructor(readonly role: UserRole) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { role: this.role };
  }
}
