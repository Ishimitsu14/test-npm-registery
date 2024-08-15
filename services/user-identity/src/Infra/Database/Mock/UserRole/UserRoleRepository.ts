import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { IUserRoleRepository, UserRole, UserRolePK } from '../../../../Domain';

export class UserRoleRepository extends MockRepository<UserRole> implements IUserRoleRepository {
  readonly EntityType = UserRole;

  async nextPK(): Promise<UserRolePK> {
    return UserRolePK.raw(v4());
  }
}
