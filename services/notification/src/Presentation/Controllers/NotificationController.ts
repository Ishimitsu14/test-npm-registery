import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { NotificationSchema } from '@schema/notification';

import { NotificationGetById, NotificationList, NotificationMakeRead } from '../../Application';

@NestRpcController()
export class NotificationController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @NestRpcMethod(NotificationSchema.RPC.MethodName('notification.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NotificationList);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NotificationSchema.RPC.MethodName('notification.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NotificationGetById);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NotificationSchema.RPC.MethodName('notification.makeRead'))
  async makeRead() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NotificationMakeRead);

    await handler.validate(params);
    return handler.execute(params);
  }
}
