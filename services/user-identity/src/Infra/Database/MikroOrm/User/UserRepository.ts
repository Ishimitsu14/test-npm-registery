import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { IUserRepository, User, UserPK } from '../../../../Domain';
import { UserSnapshot } from './Snapshots';

export class UserRepository extends MikroOrmRepository<User, UserSnapshot> implements IUserRepository {
  readonly EntityType = User;
  readonly SnapshotType = UserSnapshot;

  nextIdentity(): UserPK {
    return UserPK.raw(v4());
  }
}
