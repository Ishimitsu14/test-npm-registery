import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { UserService } from '../../Application';

@NestRpcController({})
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('user.getById'))
  async getById() {
    const { params } = useRpcRequestInfo();
    return this.userService.getById(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('user.list'))
  async list() {
    const { params } = useRpcRequestInfo();
    return this.userService.list(params);
  }
}
