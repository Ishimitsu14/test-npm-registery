import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { BidService } from '../../Application';

@NestRpcController({})
export class BidController {
  @Inject(BidService)
  private bidService: BidService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('bid.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.bidService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('bid.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.bidService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('bid.makeActive'))
  async makeActive() {
    const { params } = useRpcRequestInfo();
    return this.bidService.makeActive(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('bid.archive'))
  async archive() {
    const { params } = useRpcRequestInfo();
    return this.bidService.archive(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('bid.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    return this.bidService.update(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('bid.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    return this.bidService.reject(params);
  }
}
