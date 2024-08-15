import { BaseDbContext } from '@ddd/infra';
import { QueryResolver } from '@ddd/specifications';
import { ModuleMetadata } from '@nestjs/common';
import { LotManagementConfig } from '@shared/config';
import { MikroOrmDbContext, MockDbContext } from '@shared/db';

import { AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN } from '../../Application';
import { AGGREGATOR_RESOLVERS_INJECT_PROVIDERS } from './AggregatorResolvers';
import { MIKRO_ORM_INJECT_PROVIDERS } from './MikroOrm';
import { MOCK_INJECT_PROVIDERS } from './Mock';

export const DATABASE_INJECT: ModuleMetadata['providers'] = []
  .concat(LotManagementConfig.database.useMock ? MOCK_INJECT_PROVIDERS : [])
  .concat(!LotManagementConfig.database.useMock ? MIKRO_ORM_INJECT_PROVIDERS : [])
  .concat([
    {
      provide: BaseDbContext,
      useExisting: LotManagementConfig.database.useMock ? MockDbContext : MikroOrmDbContext,
    },
    {
      provide: AGGREAGATION_QUERY_RESOLVER_INJECT_TOKEN,
      useExisting: QueryResolver,
    },
  ])
  .concat(AGGREGATOR_RESOLVERS_INJECT_PROVIDERS)
  .filter(Boolean);
