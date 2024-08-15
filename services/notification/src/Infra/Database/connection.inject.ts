import { BaseDbContext } from '@ddd/infra';
import { ModuleMetadata } from '@nestjs/common';
import { NotificationConfig } from '@shared/config';
import { MikroOrmDbContext, MockDbContext } from '@shared/db';

import { MIKRO_ORM_INJECT_PROVIDERS } from './MikroOrm';
import { MOCK_INJECT_PROVIDERS } from './Mock';

export const DATABASE_INJECT: ModuleMetadata['providers'] = []
  .concat(NotificationConfig.database.useMock ? MOCK_INJECT_PROVIDERS : [])
  .concat(!NotificationConfig.database.useMock ? MIKRO_ORM_INJECT_PROVIDERS : [])
  .concat({
    provide: BaseDbContext,
    useExisting: NotificationConfig.database.useMock ? MockDbContext : MikroOrmDbContext,
  })
  .filter(Boolean);
