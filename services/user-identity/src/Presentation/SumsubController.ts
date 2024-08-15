import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { UserIdentitySchema } from '@schema/user-identity';

import { SumsubGenerateVerificationLinkCommand } from '../Application';

@NestRpcController({})
export class SumsubController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('sumsub.generateVerificationLink'))
  async generateVerificationLink() {
    const handler = this.moduleRef.get(SumsubGenerateVerificationLinkCommand);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }
}
