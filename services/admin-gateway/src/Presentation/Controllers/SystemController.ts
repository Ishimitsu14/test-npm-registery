import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { SystemService } from '../../Application';

@NestRpcController({})
export class SystemController {
  @Inject(SystemService)
  private readonly systemService: SystemService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('system.getVersion'))
  async getVersion() {
    return this.systemService.getVersion();
  }
}
