import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { UserIdentitySchema } from '@schema/user-identity';

import { User, UserPK, UserProfile, UserRole } from '../../Domain';
import { UserRoleResourceMapper } from './UserRoleResourceMapper';

export class UserResourceMapper {
  @Inject(UserRoleResourceMapper)
  private userRoleResourceMapper: UserRoleResourceMapper;

  toUserKey(domain: UserPK | User): UserIdentitySchema.UserKey {
    return {
      resource: 'user_key',
      id: UserPK.isExtends(domain) ? domain.id : domain.primaryKey.id,
    };
  }

  toUser(user: User, roles: UserRole[] = []): UserIdentitySchema.User {
    return {
      resource: 'user',
      id: user.primaryKey.id,
      nickname: user.nickname.value,
      registered_at: +user.registeredAt,
      profile: this.toUserProfile(user.profile),
      auth_data: {
        address: NullableObject.isEmpty(user.authData.address) ? '' : user.authData.address.value,
      },
      verification: {
        is_verified: user.verification.isVerified,
      },
      roles: roles.map((role) => this.userRoleResourceMapper.toUserRole(role)),
    };
  }

  toUserProfile(profile: UserProfile): UserIdentitySchema.UserProfile {
    return {
      firstName: NullableObject.mapUndefined(profile.firstName),
      lastName: NullableObject.mapUndefined(profile.lastName),
      telegram: NullableObject.mapUndefined(profile.telegram, (telegram) => telegram.value),
      email: NullableObject.mapUndefined(profile.email, (email) => email.value),
      location: NullableObject.mapUndefined(profile.location, (m) => m.id),
    };
  }
}
