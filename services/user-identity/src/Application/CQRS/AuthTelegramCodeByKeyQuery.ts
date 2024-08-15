import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { AuthTelegramCodeIsExpiredError, AuthTelegramCodeNotFoundError } from '@schema/common';
import { UserIdentitySchema } from '@schema/user-identity';
import { isStringSchema, validateRoot } from '@shared/validation';

import { AuthTelegramCodePK } from '../../Domain';
import { AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { AuthResourceMapper } from '../ResourceMappers';

export type AuthTelegramCodeByKeyQueryProps = UserIdentitySchema.RPC.DTO.AuthTelegramCodeGetByKey.Payload;
export type AuthTelegramCodeByKeyQueryResult = UserIdentitySchema.RPC.DTO.AuthTelegramCodeGetByKey.Result;

export class AuthTelegramCodeByKeyQuery implements UseCase<AuthTelegramCodeByKeyQueryProps, AuthTelegramCodeByKeyQueryResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly unitOfWork: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN)
  private readonly telegramCodeRepository: InjectContext<AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN>;

  @Inject(AuthResourceMapper)
  private authResourceMapper: AuthResourceMapper;

  async validate(payload: AuthTelegramCodeByKeyQueryProps): Promise<any> {
    validateRoot(payload, {
      code: [isStringSchema],
    });
  }

  async execute(payload: AuthTelegramCodeByKeyQueryProps): Promise<AuthTelegramCodeByKeyQueryResult> {
    const telegramCodeRepository = await this.telegramCodeRepository();
    const uow = await this.unitOfWork();

    const telegramCodePk = AuthTelegramCodePK.create(payload.code);
    const telegramCode = await telegramCodeRepository.get(telegramCodePk);

    if (NullableObject.isEmpty(telegramCode)) throw new AuthTelegramCodeNotFoundError(payload.code);

    if (telegramCode.isExpired) throw new AuthTelegramCodeIsExpiredError();

    return this.authResourceMapper.toAuthTelegramCode(telegramCode);
  }
}
