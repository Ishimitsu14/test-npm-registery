import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AuthTelegramCodeInvalidError, AuthTelegramCodeIsExpiredError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { Telegram } from '@shared/common-internal';
import { isRequiredSchema, isStringSchema, validateRoot } from '@shared/validation';

import { AuthTelegramCodePK, User, UserByProfileTelegramSpecification } from '../../Domain';
import { AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';
import { AuthResourceMapper } from '../ResourceMappers';

export type AuthValidateUserByTelegramCodeCommandProps = UserIdentitySchema.RPC.DTO.AuthValidateUserByTelegramCode.Payload;
export type AuthValidateUserByTelegramCodeCommandResult = UserIdentitySchema.RPC.DTO.AuthValidateUserByTelegramCode.Result;

export class AuthValidateUserByTelegramCodeCommand implements UseCase<AuthValidateUserByTelegramCodeCommandProps, AuthValidateUserByTelegramCodeCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly unitOfWork: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN)
  private readonly telegramCodeRepository: InjectContext<AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private readonly userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @Inject(AuthResourceMapper)
  private authResourceMapper: AuthResourceMapper;

  async validate(payload: AuthValidateUserByTelegramCodeCommandProps): Promise<any> {
    validateRoot(payload, {
      code: [isStringSchema, isRequiredSchema],
      username: [isStringSchema, isRequiredSchema],
    });
  }

  async execute(payload: AuthValidateUserByTelegramCodeCommandProps): Promise<AuthValidateUserByTelegramCodeCommandResult> {
    const uow = await this.unitOfWork();

    const telegramCodeRepository = await this.telegramCodeRepository();
    const userRepository = await this.userRepository();

    const telegramCodePk = AuthTelegramCodePK.create(payload.code);
    const telegramCode = await telegramCodeRepository.get(telegramCodePk);

    if (NullableObject.isEmpty(telegramCode)) throw new AuthTelegramCodeInvalidError();

    if (telegramCode.isExpired) throw new AuthTelegramCodeIsExpiredError();

    const userByTelegramQuery = Query.create(User).addSpecification(new UserByProfileTelegramSpecification(Telegram.raw(payload.username)));
    const user = await userRepository.first(userByTelegramQuery);

    if (!NullableObject.isEmpty(user)) {
      telegramCode.setUserPK(user.primaryKey);
    }

    telegramCodeRepository.update(telegramCode);

    await uow.commit();

    return this.authResourceMapper.toAuthTelegramCode(telegramCode);
  }
}
