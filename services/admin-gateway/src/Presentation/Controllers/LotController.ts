import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { LotService } from '../../Application';

@NestRpcController({})
export class LotController {
  @Inject(LotService)
  private readonly lotService: LotService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    return this.lotService.create(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    return this.lotService.update(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.archive'))
  async archive() {
    const { params } = useRpcRequestInfo();
    return this.lotService.archive(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.lotService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.lotService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.makeActive'))
  async makeActive() {
    const { params } = useRpcRequestInfo();
    return this.lotService.makeActive(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lot.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    return this.lotService.reject(params);
  }
}
