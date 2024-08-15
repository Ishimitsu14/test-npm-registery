import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { IUserRepository, User, UserPK } from '../../../../Domain';

export class UserRepository extends MockRepository<User> implements IUserRepository {
  readonly EntityType = User;

  nextIdentity(): UserPK {
    return UserPK.raw(v4());
  }
}
