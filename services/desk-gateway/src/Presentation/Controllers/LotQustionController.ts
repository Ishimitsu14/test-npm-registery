import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { LotQuestionService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class LotQustionController {
  @Inject(LotQuestionService)
  private readonly lotQuestionService: LotQuestionService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lotQuestion.create'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async create() {
    const { params } = useRpcRequestInfo();
    return this.lotQuestionService.create(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('lotQuestion.list'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async list() {
    const { params } = useRpcRequestInfo();
    return this.lotQuestionService.list(params);
  }
}
