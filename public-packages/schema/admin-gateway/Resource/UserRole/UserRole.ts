import { CoreSchema } from '../../../core';
import { UserKey } from '../User';
import { UserRoleType } from './Enums';
import { UserRoleKey } from './UserRoleKey';

export interface UserRole extends CoreSchema.Resource<'user_role', UserRoleKey> {
  type: UserRoleType;
  userKey: UserKey;
  createdAt: number;
}
