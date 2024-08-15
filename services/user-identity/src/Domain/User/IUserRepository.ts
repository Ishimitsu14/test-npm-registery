import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { User } from './User';
import { UserPK } from './UserPK';

export interface IUserRepository extends IRepository<User>, IQueryRepository<User> {
  nextIdentity(): UserPK;
}
