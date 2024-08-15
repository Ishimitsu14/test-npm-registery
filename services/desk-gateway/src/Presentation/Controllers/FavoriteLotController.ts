import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { FavoriteLotService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class FavoriteLotController {
  @Inject(FavoriteLotService)
  private readonly favoriteLotService: FavoriteLotService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('favoriteLot.create'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async create() {
    const { params } = useRpcRequestInfo();
    return this.favoriteLotService.create(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('favoriteLot.delete'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async delete() {
    const { params } = useRpcRequestInfo();
    return this.favoriteLotService.delete(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('favoriteLot.list'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async list() {
    const { params } = useRpcRequestInfo();
    return this.favoriteLotService.list(params);
  }
}
