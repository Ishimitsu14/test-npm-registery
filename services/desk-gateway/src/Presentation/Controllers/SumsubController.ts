import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { SumsubService } from '../../Application/Services/SumsubService';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class SumsubController {
  @Inject(SumsubService)
  private readonly sumsubService: SumsubService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('sumsub.generateVerificationLink'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async generateVerificationLink() {
    const { params } = useRpcRequestInfo();
    return this.sumsubService.generateVerificationLink(params);
  }
}
