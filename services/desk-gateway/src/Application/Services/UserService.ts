import { forwardRef, Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { UserIdentitySchema } from '@schema/user-identity';

import { useAuthApi } from '../Contexts';
import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { UserResourceMapper } from '../ResourceMapper';

export class UserService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => UserResourceMapper))
  private userResourceMapper: UserResourceMapper;

  async updateProfile(payload: DeskGatewaySchema.RPC.DTO.UserProfileUpdate.Payload): Promise<DeskGatewaySchema.RPC.DTO.UserProfileUpdate.Result> {
    const { userId } = useAuthApi();

    await this.userIdentityRPC.send('user.updateProfile', {
      userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      telegram: payload.telegram,
      email: payload.email,
      location: payload.location,
    });
  }

  async fetch(item: UserIdentitySchema.User): Promise<DeskGatewaySchema.User> {
    return this.fetchMany([item]).then(([item]) => item);
  }

  async fetchMany(items: UserIdentitySchema.User[]): Promise<DeskGatewaySchema.User[]> {
    return items.map((item) => this.userResourceMapper.toUser(item));
  }
}
