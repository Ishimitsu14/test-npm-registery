import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { UserIdentitySchema } from '@schema/user-identity';

import { UserResourceMapper } from './UserResourceMapper';

export class AccountResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  toAccount(item: UserIdentitySchema.User): Required<AdminGatewaySchema.Account> {
    return {
      resource: 'account',
      id: item.nickname,
      nickname: item.nickname,
      registeredAt: item.registered_at,
      profile: this.userResourceMapper.toUserProfile(item.profile),
      verification: this.userResourceMapper.toUserVerification(item.verification),
      authData: this.userResourceMapper.toUserAuthData(item.auth_data),
      roles: item.roles.map((role) => this.userResourceMapper.toUserRole(role)),
    };
  }
}
