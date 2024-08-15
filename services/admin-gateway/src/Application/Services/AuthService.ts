import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { AuthNotAuthorizedError } from '@schema/common';

import { JWT_HELPER_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { AuthResourceMapper } from '../ResourceMapper';

export class AuthService {
  private allowedUserRoles: AdminGatewaySchema.UserRoleType[] = ['ADMIN'];

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRpc: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(JWT_HELPER_INJECT_TOKEN)
  private jwtHelper: JWT_HELPER_INJECT_TOKEN;

  @Inject(AuthResourceMapper)
  private authResourceMapper: AuthResourceMapper;

  async signIn(payload: AdminGatewaySchema.RPC.Payload<'auth.signIn'>): Promise<string> {
    const user = await this.userIdentityRpc.send('auth.signIn', payload);

    if (!this.validateRoles(user.roles)) {
      throw new AuthNotAuthorizedError();
    }

    const signature = this.jwtHelper.sign(user.id);
    return signature;
  }

  async generateMessage(payload: AdminGatewaySchema.AuthGenerateMessagePayload): Promise<AdminGatewaySchema.AuthGenerateMessageResult> {
    const authGeneratedMessage = await this.userIdentityRpc.send('auth.generateMessage', { domain: payload.domain, uri: payload.uri, address: payload.address });

    return this.authResourceMapper.toAuthGeneratedMessage(authGeneratedMessage);
  }

  verify(token: string) {
    return this.jwtHelper.verify(token);
  }

  private validateRoles(roles: AdminGatewaySchema.UserRole[]) {
    return roles.some((role) => this.allowedUserRoles.includes(role.type));
  }
}
