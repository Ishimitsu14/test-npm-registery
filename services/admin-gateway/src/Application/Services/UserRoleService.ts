import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

export class UserRoleService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  async create(payload: AdminGatewaySchema.UserRoleCreatePayload): Promise<AdminGatewaySchema.UserRoleCreateResult> {
    await this.userIdentityRPC.send('userRole.create', { userId: payload.userId, type: payload.type });
  }

  async delete(payload: AdminGatewaySchema.UserRoleDeletePayload): Promise<AdminGatewaySchema.UserRoleDeleteResult> {
    await this.userIdentityRPC.send('userRole.delete', { roleId: payload.roleId });
  }
}
