import { Inject, UseInterceptors } from '@nestjs/common';
import { NestRpcController, NestRpcMethod, useRpcRequestInfo } from '@packages/nestjs-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';

import { AccountService } from '../../Application';
import { OnlyAuthorizedGuard } from '../Guards';

@NestRpcController({})
export class AccountController {
  @Inject(AccountService)
  private readonly accountService: AccountService;

  @NestRpcMethod(AdminGatewaySchema.RPC.MethodName('account.me'))
  @UseInterceptors(OnlyAuthorizedGuard)
  async me() {
    const { params } = useRpcRequestInfo();
    return this.accountService.me(params);
  }
}
