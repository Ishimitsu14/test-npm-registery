import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import {
  LotArchive,
  LotCancelModeration,
  LotComplete,
  LotCreate,
  LotDuplicate,
  LotGetById,
  LotGetUploadPitchDeckURL,
  LotGetUploadTokenomicsURL,
  LotList,
  LotMakeActive,
  LotReject,
  LotSendOnModeration,
  LotUpdate,
} from '../Application';

@NestRpcController()
export class LotController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.archive'))
  async archive() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotArchive);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.cancelModeration'))
  async cancelModeration() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotCancelModeration);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.complete'))
  async complete() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotComplete);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.duplicate'))
  async duplicate() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotDuplicate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.getById'))
  async LotGetById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotGetById);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.list'))
  async LotList() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.makeActive'))
  async makeActive() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotMakeActive);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotReject);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.sendOnModeration'))
  async sendOnModeration() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotSendOnModeration);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotUpdate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.getUploadPitchDeckURL'))
  async getUploadPitchDeckURL() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotGetUploadPitchDeckURL);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lot.getUploadTokenomicsURL'))
  async getUploadTokenomicsURL() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotGetUploadTokenomicsURL);

    await handler.validate(params);
    return handler.execute(params);
  }
}
