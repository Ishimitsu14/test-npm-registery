import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { User } from '../User';

export class UserByIsVerifiedSpecification extends Specification<User> {
  constructor(readonly isVerified: boolean) {
    super();

    this.addFilter((user) => user.verification.isVerified === isVerified);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { isVerified: this.isVerified };
  }
}
