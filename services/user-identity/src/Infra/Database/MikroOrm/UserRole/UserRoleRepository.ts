import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { IUserRoleRepository, UserRole, UserRolePK } from '../../../../Domain';
import { UserRoleSnapshot } from './Snapshots';

export class UserRoleRepository extends MikroOrmRepository<UserRole, UserRoleSnapshot> implements IUserRoleRepository {
  readonly EntityType = UserRole;
  readonly SnapshotType = UserRoleSnapshot;

  async nextPK(): Promise<UserRolePK> {
    return UserRolePK.raw(v4());
  }
}
