import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { NotificationSchema } from '@schema/notification';

import { NotificationRequestCreate } from '../../Application';

@NestRpcController()
export class NotificationRequestController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @NestRpcMethod(NotificationSchema.RPC.MethodName('notificationRequest.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NotificationRequestCreate);

    await handler.validate(params);
    return handler.execute(params);
  }
}
