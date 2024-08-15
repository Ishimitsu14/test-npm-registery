import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { AssetFaqCreate, AssetFaqDelete, AssetFaqGetById, AssetFaqList, AssetFaqUpdate } from '../Application/CQRS/AssetFaq';

@NestRpcController()
export class AssetFaqController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('assetFaq.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetFaqCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('assetFaq.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetFaqUpdate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('assetFaq.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetFaqList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('assetFaq.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetFaqGetById);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('assetFaq.delete'))
  async delete() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetFaqDelete);

    await handler.validate(params);
    return handler.execute(params);
  }
}
