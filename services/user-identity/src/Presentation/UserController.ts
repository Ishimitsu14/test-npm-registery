import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { UserIdentitySchema } from '@schema/user-identity';

import { UserGetByKeyQuery, UserListQuery, UserVerificationUpdateCommand } from '../Application';
import { UserProfileUpdate } from '../Application/CQRS/UserProfileUpdate';

@NestRpcController({})
export class UserController {
  @Inject(ModuleRef)
  private readonly moduleRef: ModuleRef;

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('user.getByKey'))
  async getByKey() {
    const handler = this.moduleRef.get(UserGetByKeyQuery);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('user.list'))
  async list() {
    const handler = this.moduleRef.get(UserListQuery);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('user.updateProfile'))
  async updateProfile() {
    const handler = this.moduleRef.get(UserProfileUpdate);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }

  @NestRpcMethod(UserIdentitySchema.RPC.MethodName('user.updateVerification'))
  async updateVerification() {
    const handler = this.moduleRef.get(UserVerificationUpdateCommand);
    const { params } = useRpcRequestInfo();

    await handler.validate(params);
    return handler.execute(params);
  }
}
