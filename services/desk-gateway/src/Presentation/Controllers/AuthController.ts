import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo, useRpcResponseInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { AuthService } from '../../Application';

@NestRpcController({})
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('auth.signIn'))
  async signIn() {
    const { params } = useRpcRequestInfo();
    const responseInfo = useRpcResponseInfo();

    const jwtToken = await this.authService.signIn(params);
    responseInfo.setMetaByKey<DeskGatewaySchema.RPC.ServerMeta>('authToken', jwtToken, 'success');
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('auth.telegramCheckSignIn'))
  async checkTelegramCodeByKey() {
    const { params } = useRpcRequestInfo();
    const responseInfo = useRpcResponseInfo();

    const { token, status } = await this.authService.telegramCheckSignIn(params);

    if (token) {
      responseInfo.setMetaByKey<DeskGatewaySchema.RPC.ServerMeta>('authToken', token, 'success');
    }

    return {
      status,
    };
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('auth.generateMessage'))
  generateMessage() {
    const { params } = useRpcRequestInfo();
    return this.authService.generateMessage(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('auth.generateTelegramCode'))
  generateTelegramCode() {
    const { params } = useRpcRequestInfo();
    return this.authService.generateTelegramMessage(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('auth.telegramVerifyWebApp'))
  async telegramVerifyWebApp() {
    const { params } = useRpcRequestInfo();
    const responseInfo = useRpcResponseInfo();

    const token = await this.authService.verifyTelegramWebApp(params);

    if (token) {
      responseInfo.setMetaByKey<DeskGatewaySchema.RPC.ServerMeta>('authToken', token, 'success');
    }
  }
}
