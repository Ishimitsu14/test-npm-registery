import { Inject } from '@nestjs/common';
import { TgGatewaySchema } from '@schema/tg-gateway';

import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

export class AuthService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRpc: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  async signIn(payload: TgGatewaySchema.RPC.DTO.AuthSignInWithTelegram.Payload): Promise<TgGatewaySchema.RPC.DTO.AuthSignInWithTelegram.Result> {
    await this.userIdentityRpc.send('auth.signInWithTelegram', {
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      code: payload.code,
    });
  }

  async validateUserByCode(payload: TgGatewaySchema.RPC.DTO.AuthValidateUserByTelegramCode.Payload): Promise<TgGatewaySchema.RPC.DTO.AuthValidateUserByTelegramCode.Result> {
    const telegramCode = await this.userIdentityRpc.send('auth.validateUserByTelegramCode', {
      code: payload.code,
      username: payload.username,
    });

    return telegramCode;
  }
}
