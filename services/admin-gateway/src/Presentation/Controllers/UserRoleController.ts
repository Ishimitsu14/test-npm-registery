import { Inject } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { UserRoleService } from '../../Application';

@NestRpcController({})
export class UserRoleController {
  @Inject(UserRoleService)
  private readonly userRoleService: UserRoleService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('userRole.create'))
  async create() {
    const { params } = useRpcRequestInfo();
    return this.userRoleService.create(params);
  }

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('userRole.delete'))
  async delete() {
    const { params } = useRpcRequestInfo();
    return this.userRoleService.delete(params);
  }
}
