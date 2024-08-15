import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { FavoriteLotCreate, FavoriteLotDelete, FavoriteLotList } from '../Application';

@NestRpcController()
export class FavoriteLotController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('favoriteLot.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FavoriteLotCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('favoriteLot.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FavoriteLotList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('favoriteLot.delete'))
  async delete() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FavoriteLotDelete);

    await handler.validate(params);
    return handler.execute(params);
  }
}
