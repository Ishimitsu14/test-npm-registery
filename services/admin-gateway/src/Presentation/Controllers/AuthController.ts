import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo, useRpcResponseInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { AuthService } from '../../Application';

@NestRpcController({})
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('auth.signIn'))
  async signIn() {
    const { params } = useRpcRequestInfo();
    const responseInfo = useRpcResponseInfo();

    const jwtToken = await this.authService.signIn(params);
    responseInfo.setMetaByKey<AdminGatewaySchema.RPC.ServerMeta>('authToken', jwtToken, 'success');
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('auth.generateMessage'))
  generateMessage() {
    const { params } = useRpcRequestInfo();
    return this.authService.generateMessage(params);
  }
}
