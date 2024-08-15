import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { NotificationService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class NotificationController {
  @Inject(NotificationService)
  private readonly notificationService: NotificationService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('notification.getById'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.notificationService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('notification.list'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async list() {
    const { params } = useRpcRequestInfo();
    return this.notificationService.list(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('notification.makeRead'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async makeRead() {
    const { params } = useRpcRequestInfo();
    return this.notificationService.makeReaded(params);
  }
}
