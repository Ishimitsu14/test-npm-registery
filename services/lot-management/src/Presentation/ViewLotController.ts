import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { ViewLotCreate, ViewLotGetByLotId } from '../Application';

@NestRpcController()
export class ViewLotController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('viewLot.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(ViewLotCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('viewLot.getByLotId'))
  async getByLotId() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(ViewLotGetByLotId);

    await handler.validate(params);
    return handler.execute(params);
  }
}
