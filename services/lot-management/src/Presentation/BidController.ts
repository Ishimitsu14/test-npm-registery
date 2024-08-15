import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { BidAccept, BidArchive, BidCreate, BidGetById, BidList, BidMakeActive, BidReject, BidUpdate } from '../Application/CQRS/Bid';

@NestRpcController()
export class BidController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidGetById);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.accept'))
  async accept() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidAccept);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidReject);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.makeActive'))
  async makeActive() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidMakeActive);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.archive'))
  async archive() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidArchive);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('bid.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(BidUpdate);

    await handler.validate(params);
    return handler.execute(params);
  }
}
