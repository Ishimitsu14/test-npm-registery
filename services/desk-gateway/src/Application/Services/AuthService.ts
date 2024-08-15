import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { JWT_HELPER_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { AuthResourceMapper } from '../ResourceMapper';

export class AuthService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRpc: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(JWT_HELPER_INJECT_TOKEN)
  private jwtHelper: JWT_HELPER_INJECT_TOKEN;

  @Inject(AuthResourceMapper)
  private authResourceMapper: AuthResourceMapper;

  async signIn(payload: DeskGatewaySchema.AuthSignInPayload): Promise<string> {
    const user = await this.userIdentityRpc.send('auth.signIn', {
      message: payload.message,
      signature: payload.signature,
      signatureHash: payload.signatureHash,
    });

    const signature = this.jwtHelper.sign(user.id);
    return signature;
  }

  async telegramCheckSignIn(payload: DeskGatewaySchema.AuthTelegramCheckSignInPayload): Promise<DeskGatewaySchema.AuthTelegramCheckSignInResult> {
    const result = await this.userIdentityRpc.send('auth.telegramCodeByKey', { code: payload.code });
    let signature = null;
    if (result.userPK) {
      signature = this.jwtHelper.sign(result.userPK);
    }

    return {
      token: signature,
      status: signature ? 'Success' : 'Pending',
    };
  }

  async generateMessage(payload: DeskGatewaySchema.AuthGenerateMessagePayload): Promise<DeskGatewaySchema.AuthGenerateMessageResult> {
    const result = await this.userIdentityRpc.send('auth.generateMessage', { domain: payload.domain, uri: payload.uri, address: payload.address });

    return this.authResourceMapper.toAuthGeneratedMessage(result);
  }

  async generateTelegramMessage(payload: DeskGatewaySchema.AuthGenerateTelegramCodePayload): Promise<DeskGatewaySchema.AuthGenerateTelegramCodeResult> {
    const result = await this.userIdentityRpc.send('auth.generateTelegramCode', {});

    return this.authResourceMapper.toAuthTelegramCode(result);
  }

  async verifyTelegramWebApp(payload: DeskGatewaySchema.AuthTelegramVerifyWebAppPayload): Promise<string> {
    const user = await this.userIdentityRpc.send('auth.telegramVerifyWebApp', {
      username: payload.username,
      hash: payload.hash,
      checkDataString: payload.checkDataString,
    });

    const signature = this.jwtHelper.sign(user.id);
    return signature;
  }

  verify(token: string) {
    return this.jwtHelper.verify(token);
  }
}
