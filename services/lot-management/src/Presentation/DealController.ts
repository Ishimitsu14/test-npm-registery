import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { DealComplete, DealGetById, DealList, DealReject, DealUpdateKeyResult } from '../Application';

@NestRpcController()
export class DealController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('deal.complete'))
  async complete() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(DealComplete);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('deal.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(DealGetById);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('deal.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(DealList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('deal.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(DealReject);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('deal.updateKeyResult'))
  async updateKeyResult() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(DealUpdateKeyResult);

    await handler.validate(params);
    return handler.execute(params);
  }
}
