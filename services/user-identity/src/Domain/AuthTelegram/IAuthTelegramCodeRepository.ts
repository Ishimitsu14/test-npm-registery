import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { AuthTelegramCode } from './AuthTelegramCode';
import { AuthTelegramCodePK } from './AuthTelegramCodePK';

export interface IAuthTelegramCodeRepository extends IRepository<AuthTelegramCode>, IQueryRepository<AuthTelegramCode> {
  nextIdentity(): Promise<AuthTelegramCodePK>;
}
