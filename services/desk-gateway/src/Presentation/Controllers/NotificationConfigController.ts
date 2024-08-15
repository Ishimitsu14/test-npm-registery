import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { NotificationConfigService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class NotificationConfigController {
  @Inject(NotificationConfigService)
  private readonly notificationConfigService: NotificationConfigService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('notificationConfig.get'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async get() {
    const { params } = useRpcRequestInfo();
    return this.notificationConfigService.get(params);
  }

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('notificationConfig.update'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async update() {
    const { params } = useRpcRequestInfo();
    return this.notificationConfigService.update(params);
  }
}
