import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { AssetArchive, AssetCreate, AssetGetById, AssetGetUploadAnalyticURL, AssetGetUploadLogoURL, AssetList, AssetMakeActive, AssetResolve, AssetUpdate } from '../Application';

@NestRpcController({})
export class AssetController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetGetById);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.getUploadAnalyticURL'))
  async getUploadAnalyticURL() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetGetUploadAnalyticURL);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.getUploadLogoURL'))
  async getUploadLogoURL() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetGetUploadLogoURL);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetList);

    await handler.validate(params);
    return await handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetUpdate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.resolve'))
  async resolve() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetResolve);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.makeActive'))
  async makeActive() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetMakeActive);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('asset.archive'))
  async archive() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(AssetArchive);

    await handler.validate(params);
    return handler.execute(params);
  }
}
