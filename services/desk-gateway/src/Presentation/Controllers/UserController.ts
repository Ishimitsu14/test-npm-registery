import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { UserService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('user.updateProfile'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async updateProfile() {
    const { params } = useRpcRequestInfo();
    return this.userService.updateProfile(params);
  }
}
