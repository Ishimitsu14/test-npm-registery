import { BaseDbContext } from '@ddd/infra';
import { ModuleMetadata } from '@nestjs/common';
import { UserIdentityConfig } from '@shared/config';
import { MikroOrmDbContext, MockDbContext } from '@shared/db';

import { MIKRO_ORM_INJECT_PROVIDERS } from './MikroOrm';
import { MOCK_INJECT_PROVIDERS } from './Mock';

export const DATABASE_INJECT: ModuleMetadata['providers'] = []
  .concat(UserIdentityConfig.database.useMock ? MOCK_INJECT_PROVIDERS : [])
  .concat(!UserIdentityConfig.database.useMock ? MIKRO_ORM_INJECT_PROVIDERS : [])
  .concat({
    provide: BaseDbContext,
    useExisting: UserIdentityConfig.database.useMock ? MockDbContext : MikroOrmDbContext,
  })
  .filter(Boolean);
