import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';

import { UserVerification } from '../../../../../Domain';

@Embeddable()
export class UserVerificationSnapshot implements ISnapshot<UserVerification> {
  constructor() {}

  @Property({ name: 'is_verified', type: 'bool' })
  isVerified: boolean;

  applyDomain(domain: UserVerification): void {
    this.isVerified = domain.isVerified;
  }

  toDomain(): UserVerification {
    return UserVerification.fromSnapshot(this.isVerified);
  }
}
