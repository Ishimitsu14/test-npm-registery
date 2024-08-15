import { forwardRef, Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { DeskGatewaySchema } from '@schema/desk-gateway';

import { AccountService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class AccountController {
  @Inject(forwardRef(() => AccountService))
  private readonly accountService: AccountService;

  @NestRpcMethod(DeskGatewaySchema.RPC.MethodName('account.me'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async me() {
    const { params } = useRpcRequestInfo();
    return this.accountService.me(params);
  }
}
