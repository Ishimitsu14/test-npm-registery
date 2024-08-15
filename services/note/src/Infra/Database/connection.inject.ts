import { BaseDbContext } from '@ddd/infra';
import { ModuleMetadata } from '@nestjs/common';
import { NoteConfig } from '@shared/config';
import { MikroOrmDbContext, MockDbContext } from '@shared/db';

import { MIKRO_ORM_INJECT_PROVIDERS } from './MikroOrm';
import { MOCK_INJECT_PROVIDERS } from './Mock';

export const DATABASE_INJECT: ModuleMetadata['providers'] = []
  .concat(NoteConfig.database.useMock ? MOCK_INJECT_PROVIDERS : [])
  .concat(!NoteConfig.database.useMock ? MIKRO_ORM_INJECT_PROVIDERS : [])
  .concat({
    provide: BaseDbContext,
    useExisting: NoteConfig.database.useMock ? MockDbContext : MikroOrmDbContext,
  })
  .filter(Boolean);
