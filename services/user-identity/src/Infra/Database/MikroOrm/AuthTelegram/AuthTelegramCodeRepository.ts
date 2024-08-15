import { MikroOrmRepository } from '@shared/db';

import { AuthTelegramCode, AuthTelegramCodePK, IAuthTelegramCodeRepository } from '../../../../Domain';
import { AuthTelegramCodeSnapshot } from './Snapshots';

export class AuthTelegramCodeRepository extends MikroOrmRepository<AuthTelegramCode, AuthTelegramCodeSnapshot> implements IAuthTelegramCodeRepository {
  readonly EntityType = AuthTelegramCode;
  readonly SnapshotType = AuthTelegramCodeSnapshot;

  async nextIdentity(): Promise<AuthTelegramCodePK> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return AuthTelegramCodePK.create(code);
  }
}
