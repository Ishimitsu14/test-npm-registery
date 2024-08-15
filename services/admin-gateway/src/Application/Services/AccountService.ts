import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { AuthNotAuthorizedError, UserNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';

import { useAuthApi } from '../Contexts';
import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { AccountResourceMapper } from '../ResourceMapper';

export class AccountService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRpc: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(AccountResourceMapper)
  private accountResourceMapper: AccountResourceMapper;

  async me(payload: AdminGatewaySchema.AccountMePayload): Promise<AdminGatewaySchema.AccountMeResult> {
    const { userId } = useAuthApi();

    try {
      const user = await this.userIdentityRpc.send('user.getByKey', { id: userId });
      return this.fetch(user);
    } catch (err) {
      if (UserNotFoundError.isExtends(err)) throw new AuthNotAuthorizedError();
      throw err;
    }
  }

  async fetch(item: UserIdentitySchema.User): Promise<AdminGatewaySchema.Account> {
    return this.fetchMany([item]).then(([item]) => item);
  }

  async fetchMany(items: UserIdentitySchema.User[]): Promise<AdminGatewaySchema.Account[]> {
    return items.map((item) => this.accountResourceMapper.toAccount(item));
  }
}
