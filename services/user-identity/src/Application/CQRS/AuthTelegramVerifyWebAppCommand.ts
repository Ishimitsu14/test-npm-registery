import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AuthTelegramSignatureInvalidError, UserWithTelegramUsernameNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { Telegram } from '@shared/common-internal';
import { TgGatewayConfig } from '@shared/config';
import { isStringSchema, validateRoot } from '@shared/validation';

import { User, UserByProfileTelegramSpecification } from '../../Domain';
import { HASH_STRING_HELPER_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';
import { UserResourceMapper } from '../ResourceMappers';

export type AuthTelegramVerifyWebAppCommandProps = UserIdentitySchema.RPC.DTO.AuthTelegramVerifyWebApp.Payload;
export type AuthTelegramVerifyWebAppCommandResult = UserIdentitySchema.RPC.DTO.AuthTelegramVerifyWebApp.Result;

export class AuthTelegramVerifyWebAppCommand implements UseCase<AuthTelegramVerifyWebAppCommandProps, AuthTelegramVerifyWebAppCommandResult> {
  @Inject(HASH_STRING_HELPER_INJECT_TOKEN)
  private readonly hashStringHelper: HASH_STRING_HELPER_INJECT_TOKEN;

  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  async validate(payload: AuthTelegramVerifyWebAppCommandProps): Promise<any> {
    validateRoot(payload, {
      username: [isStringSchema],
      hash: [isStringSchema],
      checkDataString: [isStringSchema],
    });
  }

  async execute(payload: AuthTelegramVerifyWebAppCommandProps): Promise<AuthTelegramVerifyWebAppCommandResult> {
    const userRepository = await this.userRepository();

    const secretKey = this.hashStringHelper.getSignatureHash(TgGatewayConfig.bot.token, 'WebAppData');
    const hashString = this.hashStringHelper.getSignatureHash(payload.checkDataString, secretKey);

    if (!this.hashStringHelper.verifyTwoHash(this.hashStringHelper.getHex(hashString), payload.hash)) throw new AuthTelegramSignatureInvalidError();

    const userByTelegramQuery = Query.create(User).addSpecification(new UserByProfileTelegramSpecification(Telegram.raw(payload.username)));
    const user = await userRepository.first(userByTelegramQuery);

    if (NullableObject.isEmpty(user)) throw new UserWithTelegramUsernameNotFoundError(payload.username);

    return this.userResourceMapper.toUser(user);
  }
}
