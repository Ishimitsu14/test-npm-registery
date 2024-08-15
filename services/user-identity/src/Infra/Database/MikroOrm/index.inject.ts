import { ModuleMetadata } from '@nestjs/common';
import { UserIdentityConfig } from '@shared/config';
import { mikroOrmInject } from '@shared/db';

import { AUTH_TELEGRAM_CODE_INJECT_PROVIDERS } from './AuthTelegram';
import { USER_INJECT_PROVIDERS } from './User';
import { USER_ROLE_INJECT_PROVIDERS } from './UserRole';

export const MIKRO_ORM_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mikroOrmInject({
    url: UserIdentityConfig.database.url,
    synchronize: UserIdentityConfig.database.useSync,
    imports: import('./snapshots.export'),
    useSSL: UserIdentityConfig.database.useSSL,
    debug: UserIdentityConfig.logger.level === 'debug',
  }),
  ...AUTH_TELEGRAM_CODE_INJECT_PROVIDERS,
  ...USER_INJECT_PROVIDERS,
  ...USER_ROLE_INJECT_PROVIDERS,
];
