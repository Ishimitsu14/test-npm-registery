import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { LotManagementSchema } from '@schema/lot-management';

import { LotQuestionApprove, LotQuestionCreate, LotQuestionList, LotQuestionReject } from '../Application';

@NestRpcController()
export class LotQuestionController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lotQuestion.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotQuestionCreate);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lotQuestion.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotQuestionList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lotQuestion.approve'))
  async approve() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotQuestionApprove);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(LotManagementSchema.RPC.MethodName('lotQuestion.reject'))
  async reject() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(LotQuestionReject);

    await handler.validate(params);
    return handler.execute(params);
  }
}
