import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { NotificationSchema } from '@schema/notification';

import { NotificationConfigGet, NotificationConfigUpdate } from '../../Application';

@NestRpcController()
export class NotificationConfigController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @NestRpcMethod(NotificationSchema.RPC.MethodName('notificationConfig.get'))
  async get() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NotificationConfigGet);

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(NotificationSchema.RPC.MethodName('notificationConfig.update'))
  async update() {
    const { params } = useRpcRequestInfo();
    const handler = this.moduleRef.get(NotificationConfigUpdate);

    await handler.validate(params);
    return handler.execute(params);
  }
}
