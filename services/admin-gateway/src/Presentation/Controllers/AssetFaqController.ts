import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { AssetFaqService } from '../../Application';

@NestRpcController({})
export class AssetFaqController {
  @Inject(AssetFaqService)
  private readonly assetFaqService: AssetFaqService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('assetFaq.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    return this.assetFaqService.create(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('assetFaq.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.assetFaqService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('assetFaq.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.assetFaqService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('assetFaq.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    return this.assetFaqService.update(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('assetFaq.delete'))
  async delete() {
    const { params } = useRpcRequestInfo();
    return this.assetFaqService.delete(params);
  }
}
