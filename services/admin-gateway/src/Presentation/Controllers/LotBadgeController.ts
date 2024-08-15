import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { LotBadgeService } from '../../Application';

@NestRpcController({})
export class LotBadgeController {
  @Inject(LotBadgeService)
  private readonly lotBadgeService: LotBadgeService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lotBadge.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    return this.lotBadgeService.create(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('lotBadge.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.lotBadgeService.list(params);
  }
}
