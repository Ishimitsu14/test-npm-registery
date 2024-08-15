import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { FeedbackService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class FeedbackController {
  @Inject(FeedbackService)
  private readonly feedbackService: FeedbackService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('feedback.create'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async create() {
    const { params } = useRpcRequestInfo();
    return this.feedbackService.create(params);
  }
}
