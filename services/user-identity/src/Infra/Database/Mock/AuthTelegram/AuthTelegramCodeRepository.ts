import { MockRepository } from '@shared/db';

import { AuthTelegramCode, AuthTelegramCodePK, IAuthTelegramCodeRepository } from '../../../../Domain';

export class AuthTelegramCodeRepository extends MockRepository<AuthTelegramCode> implements IAuthTelegramCodeRepository {
  readonly EntityType = AuthTelegramCode;

  async nextIdentity(): Promise<AuthTelegramCodePK> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return AuthTelegramCodePK.create(code);
  }
}
