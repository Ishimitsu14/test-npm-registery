import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { FeedbackService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class FeedbackController {
  @Inject(FeedbackService)
  private readonly feedbackService: FeedbackService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('feedback.getById'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async getById() {
    const { params } = useRpcRequestInfo();

    return this.feedbackService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('feedback.list'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async list() {
    const { params } = useRpcRequestInfo();

    return this.feedbackService.list(params);
  }
}
