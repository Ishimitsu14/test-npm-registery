import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserIdentitySchema } from '@schema/user-identity';
import { UserIdentityConfig } from '@shared/config';
import { validateRoot } from '@shared/validation';

import { AuthTelegramCode } from '../../Domain';
import { AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN, UNIT_OF_WORK_INJECT_TOKEN } from '../InjectTokens';
import { AuthResourceMapper } from '../ResourceMappers';

export type AuthGenerateTelegramCodeCommandProps = UserIdentitySchema.RPC.DTO.AuthGenerateTelegramCode.Payload;
export type AuthGenerateTelegramCodeCommandResult = UserIdentitySchema.RPC.DTO.AuthGenerateTelegramCode.Result;

export class AuthGenerateTelegramCodeCommand implements UseCase<AuthGenerateTelegramCodeCommandProps, AuthGenerateTelegramCodeCommandResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly unitOfWork: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN)
  private readonly telegramCodeRepository: InjectContext<AUTH_TELEGRAM_CODE_REPOSITORY_INJECT_TOKEN>;

  @Inject(AuthResourceMapper)
  private authResourceMapper: AuthResourceMapper;

  async validate(payload: AuthGenerateTelegramCodeCommandProps): Promise<any> {
    validateRoot(payload, {});
  }

  async execute(payload: AuthGenerateTelegramCodeCommandProps): Promise<AuthGenerateTelegramCodeCommandResult> {
    const uow = await this.unitOfWork();
    const telegramCodeRepository = await this.telegramCodeRepository();
    const currentDate = new Date();

    const primaryKey = await telegramCodeRepository.nextIdentity();
    const telegramCode = AuthTelegramCode.create(primaryKey, new Date(currentDate.getTime() + UserIdentityConfig.auth.telegramCodeLifetimeMS));

    telegramCodeRepository.add(telegramCode);

    await uow.commit();

    return this.authResourceMapper.toAuthTelegramCode(telegramCode);
  }
}
