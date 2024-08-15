import { QueryResolver } from '@ddd/specifications';
import { ModuleMetadata, Scope } from '@nestjs/common';

import { commonDatabaseInject } from '../Common';
import { createMikroEntityManager, createMikroOrm, CreateMikroOrmOptions, MikroOrmDbContext } from './Connection';
import { MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN, MIKRO_ORM_INJECT_TOKEN } from './InjectTokens';
import { MikroOrmQueryResolver } from './MikroOrmQueryResolver';

export function mikroOrmInject(options: CreateMikroOrmOptions): ModuleMetadata['providers'] {
  return [
    ...commonDatabaseInject(new MikroOrmQueryResolver()),
    {
      provide: MikroOrmQueryResolver,
      useExisting: QueryResolver,
    },
    {
      provide: MIKRO_ORM_INJECT_TOKEN,
      useFactory: () => createMikroOrm(options),
    },
    {
      provide: MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN,
      useFactory: (mikroOrm: MIKRO_ORM_INJECT_TOKEN) => createMikroEntityManager(mikroOrm),
      scope: Scope.REQUEST,
      inject: [MIKRO_ORM_INJECT_TOKEN],
    },
    { provide: MikroOrmDbContext, useClass: MikroOrmDbContext, scope: Scope.REQUEST },
  ];
}
