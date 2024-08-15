import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { BidService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class BidController {
  @Inject(BidService)
  private bidService: BidService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('bid.create'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async create() {
    const { params } = useRpcRequestInfo();
    return this.bidService.create(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('bid.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.bidService.list(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('bid.accept'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async accept() {
    const { params } = useRpcRequestInfo();
    return this.bidService.accept(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('bid.reject'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async reject() {
    const { params } = useRpcRequestInfo();
    return this.bidService.reject(params);
  }
}
