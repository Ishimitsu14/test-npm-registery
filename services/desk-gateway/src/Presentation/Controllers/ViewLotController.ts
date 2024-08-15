import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { ViewLotService } from '../../Application';

@NestRpcController({})
export class ViewLotController {
  @Inject(ViewLotService)
  private readonly viewLotService: ViewLotService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('viewLot.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    return this.viewLotService.create(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('viewLot.getByLotId'))
  async getByLotId() {
    const { params } = useRpcRequestInfo();
    return this.viewLotService.getByLotId(params);
  }
}
