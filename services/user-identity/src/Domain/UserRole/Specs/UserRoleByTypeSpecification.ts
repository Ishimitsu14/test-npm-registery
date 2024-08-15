import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { UserRoleType } from '../Enums';
import { UserRole } from '../UserRole';

export class UserRoleByTypeSpecification extends Specification<UserRole> {
  readonly types: UserRoleType[];

  constructor(type: UserRoleType | UserRoleType[]) {
    super();

    this.types = Array.isArray(type) ? type : [type];

    this.addFilter((userRole) => {
      return this.types.some((t) => t.isEquals(userRole.type));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.types];
  }
}
