import { BaseDbContext } from '@ddd/infra';
import { ModuleMetadata } from '@nestjs/common';
import { FileManagementConfig } from '@shared/config';
import { MikroOrmDbContext, MockDbContext } from '@shared/db';

import { MIKRO_ORM_INJECT_PROVIDERS } from './MikroOrm';
import { MOCK_INJECT_PROVIDERS } from './Mock';

export const DATABASE_INJECT: ModuleMetadata['providers'] = []
  .concat(FileManagementConfig.database.useMock ? MOCK_INJECT_PROVIDERS : [])
  .concat(!FileManagementConfig.database.useMock ? MIKRO_ORM_INJECT_PROVIDERS : [])
  .concat({
    provide: BaseDbContext,
    useExisting: FileManagementConfig.database.useMock ? MockDbContext : MikroOrmDbContext,
  })
  .filter(Boolean);
