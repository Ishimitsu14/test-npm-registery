import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { TgGatewaySchema } from '@schema/tg-gateway';

import { AuthService } from '../Application';

@NestRpcController({})
export class AuthController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(TgGatewaySchema.RPC.MethodName('auth.signIn'))
  async signIn() {
    const { params } = useRpcRequestInfo();

    await this.moduleRef.get(AuthService).signIn(params);
  }
}
