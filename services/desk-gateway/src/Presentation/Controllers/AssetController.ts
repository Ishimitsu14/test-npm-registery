import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { AssetService } from '../../Application';

@NestRpcController({})
export class AssetController {
  @Inject(AssetService)
  private readonly assetService: AssetService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('asset.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.assetService.getById(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('asset.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.assetService.list(params);
  }
}
