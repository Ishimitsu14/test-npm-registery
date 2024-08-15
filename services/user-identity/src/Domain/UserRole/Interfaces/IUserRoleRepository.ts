import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { UserRole } from '../UserRole';
import { UserRolePK } from '../UserRolePK';

export interface IUserRoleRepository extends IRepository<UserRole>, IQueryRepository<UserRole> {
  nextPK(): Promise<UserRolePK>;
}
