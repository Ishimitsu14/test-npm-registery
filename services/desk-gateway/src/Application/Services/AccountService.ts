import { forwardRef, Inject } from '@nestjs/common';
import { AuthNotAuthorizedError, UserNotFoundError } from '@schema/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { UserIdentitySchema } from '@schema/user-identity';

import { useAuthApi } from '../Contexts';
import { USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { AccountResourceMapper } from '../ResourceMapper';

export class AccountService {
  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRpc: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(forwardRef(() => AccountResourceMapper))
  private accountResourceMapper: AccountResourceMapper;

  async me(payload: DeskGatewaySchema.AccountMePayload): Promise<DeskGatewaySchema.AccountMeResult> {
    const { userId } = useAuthApi();

    try {
      const user = await this.userIdentityRpc.send('user.getByKey', { id: userId });
      return this.fetch(user);
    } catch (err) {
      if (UserNotFoundError.isExtends(err)) throw new AuthNotAuthorizedError();
      throw err;
    }
  }

  async fetch(item: UserIdentitySchema.User): Promise<DeskGatewaySchema.Account> {
    return this.fetchMany([item]).then(([item]) => item);
  }

  async fetchMany(items: UserIdentitySchema.User[]): Promise<DeskGatewaySchema.Account[]> {
    return items.map((item) => this.accountResourceMapper.toAccount(item));
  }
}
