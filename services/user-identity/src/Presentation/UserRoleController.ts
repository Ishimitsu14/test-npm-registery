import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { UserIdentitySchema } from '@schema/user-identity';

import { UserRoleCreate } from '../Application/CQRS/UserRoleCreate';
import { UserRoleDelete } from '../Application/CQRS/UserRoleDelete';

@NestRpcController({})
export class UserRoleController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('userRole.create'))
  async create() {
    const handler = this.moduleRef.get(UserRoleCreate);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('userRole.delete'))
  async delete() {
    const handler = this.moduleRef.get(UserRoleDelete);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }
}
