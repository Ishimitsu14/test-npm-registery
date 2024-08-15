import { ModuleMetadata, Scope } from '@nestjs/common';
import { ASSET_REPOSITORY_INJECT_TOKEN } from 'services/lot-management/src/Application';

import { AssetRepository } from './AssetRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const ASSET_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: AssetRepository,
    useClass: AssetRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: ASSET_REPOSITORY_INJECT_TOKEN,
    useExisting: AssetRepository,
    scope: Scope.REQUEST,
  },
];
