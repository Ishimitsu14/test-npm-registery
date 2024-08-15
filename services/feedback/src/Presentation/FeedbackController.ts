import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { FeedbackSchema } from '@schema/feedback';

import { FeedbackCreateCommand, FeedbackGetByIdQuery, FeedbackListQuery } from '../Application';

@NestRpcController()
export class FeedbackController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(FeedbackSchema.RPC.MethodName('feedback.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FeedbackCreateCommand);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(FeedbackSchema.RPC.MethodName('feedback.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FeedbackGetByIdQuery);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(FeedbackSchema.RPC.MethodName('feedback.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(FeedbackListQuery);

    await handler.validate(params);
    return handler.execute(params);
  }
}
