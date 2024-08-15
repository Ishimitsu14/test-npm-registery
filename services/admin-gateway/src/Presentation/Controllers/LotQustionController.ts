import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { LotQuestionService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class LotQustionController {
  @Inject(LotQuestionService)
  private readonly lotQuestionService: LotQuestionService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lotQuestion.list'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async list() {
    const { params } = useRpcRequestInfo();
    return this.lotQuestionService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lotQuestion.approve'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async approve() {
    const { params } = useRpcRequestInfo();
    return this.lotQuestionService.approve(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lotQuestion.reject'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async reject() {
    const { params } = useRpcRequestInfo();
    return this.lotQuestionService.reject(params);
  }
}
