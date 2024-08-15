import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { UserPK } from '../../User/UserPK';
import { UserRole } from '../UserRole';

export class UserRoleByUserSpecification extends Specification<UserRole> {
  readonly userPKs: UserPK[];

  constructor(userPK: UserPK | UserPK[]) {
    super();

    this.userPKs = Array.isArray(userPK) ? userPK : [userPK];

    this.addFilter((userRole) => {
      return this.userPKs.some((m) => m.isEquals(userRole.userPK));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.userPKs];
  }
}
