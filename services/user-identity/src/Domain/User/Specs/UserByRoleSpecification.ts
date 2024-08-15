import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { UserRole } from '../../UserRole';
import { User } from '../User';

export class UserByRoleSpecification extends Specification<User> {
  constructor(readonly roles: UserRole[] | Specification<UserRole>) {
    super();

    if (Specification.isExtends(roles)) {
      this.lockLocalSpecify();
    }

    if (Array.isArray(roles)) {
      this.addFilter((user) => {
        return roles.some((role) => {
          return role.userPK.isEquals(user.primaryKey);
        });
      });
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.roles];
  }
}
