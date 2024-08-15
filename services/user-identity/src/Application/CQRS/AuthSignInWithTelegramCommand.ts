import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AuthTelegramCodeInvalidError, AuthTelegramCodeIsExpiredError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { Telegram } from '@shared/common-internal';
import { isStringSchema, validateRoot } from '@shared/validation';
import { v4 } from 'uuid';

import { AuthTelegramCodePK, User, UserAuthData, UserByProfileTelegramSpecification, UserNickname, UserProfile, UserVerification } from '../../Domain';
import { AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN, HASH_STRING_HELPER_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';
import { UserResourceMapper } from '../ResourceMappers';

export type AuthSignInWithTelegramCommandProps = UserIdentitySchema.RPC.DTO.AuthSignInWithTelegram.Payload;
export type AuthSignInWithTelegramCommandResult = UserIdentitySchema.RPC.DTO.AuthSignInWithTelegram.Result;

export class AuthSignInWithTelegramCommand implements UseCase<AuthSignInWithTelegramCommandProps, AuthSignInWithTelegramCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly unitOfWork: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN)
  private readonly telegramCodeRepository: InjectContext<AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN>;

  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @Inject(HASH_STRING_HELPER_INJECT_TOKEN)
  private readonly hashStringHelper: HASH_STRING_HELPER_INJECT_TOKEN;

  async validate(payload: AuthSignInWithTelegramCommandProps): Promise<any> {
    validateRoot(payload, {
      code: [isStringSchema],
      firstName: [isStringSchema],
      lastName: [isStringSchema],
      username: [isStringSchema],
    });
  }

  async execute(payload: AuthSignInWithTelegramCommandProps): Promise<AuthSignInWithTelegramCommandResult> {
    const userRepository = await this.userRepository();
    const telegramCodeRepository = await this.telegramCodeRepository();
    const uow = await this.unitOfWork();

    const telegramCodePk = AuthTelegramCodePK.create(payload.code);
    const telegramCode = await telegramCodeRepository.get(telegramCodePk);

    if (NullableObject.isEmpty(telegramCode)) throw new AuthTelegramCodeInvalidError();

    if (telegramCode.isExpired) throw new AuthTelegramCodeIsExpiredError();

    const userByTelegramQuery = Query.create(User).addSpecification(new UserByProfileTelegramSpecification(Telegram.raw(payload.username)));
    let user = await userRepository.first(userByTelegramQuery);

    if (NullableObject.isEmpty(user)) {
      const userPK = userRepository.nextIdentity();
      const hashedUserNickname = this.hashStringHelper.getSignatureHash(v4(), 'telegram_username');
      const userNickname = UserNickname.raw(this.hashStringHelper.getHex(hashedUserNickname));
      const authData = UserAuthData.create(NullableObject);
      const profile = UserProfile.create(payload.firstName, payload.lastName, Telegram.raw(payload.username), NullableObject, NullableObject);
      const verification = UserVerification.raw(false);
      user = User.createNew(userPK, authData, userNickname, profile, verification);
      userRepository.add(user);
    }

    telegramCode.setUserPK(user.primaryKey);
    telegramCodeRepository.update(telegramCode);

    await uow.commit();
  }
}
