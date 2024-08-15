import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { DealService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class DealController {
  @Inject(DealService)
  private dealService: DealService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('deal.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.dealService.getById(params);
  }

  @UseInterceptors(OnlyAuthorizedGuard)
  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('deal.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.dealService.list(params);
  }
}
