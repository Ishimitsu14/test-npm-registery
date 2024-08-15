import { ValueObjectAtomicValue } from '@ddd/domain';
import { AbstractDomainEvent } from '@ddd/events';

import { User } from '../User';
import { UserProfile } from '../UserProfile';

export class UserProfileUpdatedEvent extends AbstractDomainEvent {
  constructor(
    readonly user: User,
    readonly prevProfile: UserProfile,
  ) {
    super();
  }

  protected getEventAtomicValues(): ValueObjectAtomicValue {
    return { user: this.user, prevProfile: this.prevProfile };
  }
}
