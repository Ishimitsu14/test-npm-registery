import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { LotBadgeCreate, LotBadgeList } from '../Application';

@NestRpcController()
export class LotBadgeController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lotBadge.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotBadgeCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lotBadge.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotBadgeList);

    await handler.validate(params);
    return handler.execute(params);
  }
}
