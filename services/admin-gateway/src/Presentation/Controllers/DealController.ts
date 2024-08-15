import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { DealService } from '../../Application';

@NestRpcController({})
export class DealController {
  @Inject(DealService)
  private dealService: DealService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('deal.complete'))
  async complete() {
    const { params } = useRpcRequestInfo();
    return this.dealService.complete(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('deal.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.dealService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('deal.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.dealService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('deal.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    return this.dealService.reject(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('deal.updateKeyResult'))
  async updateKeyResult() {
    const { params } = useRpcRequestInfo();
    return this.dealService.updateKeyResult(params);
  }
}
