import { QueryResolver } from '@ddd/specifications';
import { ModuleMetadata, Scope } from '@nestjs/common';

import { commonDatabaseInject } from '../Common';
import { MockDbContext } from './MockDbContext';
import { MockQueryResolver } from './MockQueryResolver';
import { MockStoreRegistry } from './MockStore';

export function mockInject(): ModuleMetadata['providers'] {
  return [
    ...commonDatabaseInject(new MockQueryResolver()),
    { provide: MockQueryResolver, useExisting: QueryResolver },
    { provide: MockDbContext, useClass: MockDbContext, scope: Scope.REQUEST },
    { provide: MockStoreRegistry, useFactory: () => new MockStoreRegistry() },
  ];
}
