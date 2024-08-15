import { UserIdentitySchema } from '@schema/user-identity';

import { UserPK, UserRole } from '../../Domain';

export class UserRoleResourceMapper {
  toUserRole(role: UserRole): UserIdentitySchema.UserRole {
    return {
      resource: 'user_role',
      id: role.primaryKey.id,

      userKey: this.toUserKey(role.userPK),
      type: role.type.id,
      createdAt: +role.createdAt,
    };
  }

  toUserKey(userPK: UserPK): UserIdentitySchema.UserKey {
    return {
      resource: 'user_key',
      id: userPK.id,
    };
  }
}
