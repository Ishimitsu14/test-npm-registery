import { ModuleMetadata, Scope } from '@nestjs/common';

import { LOT_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { LotRepository } from './LotRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const LOT_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: LotRepository,
    useClass: LotRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: LOT_REPOSITORY_INJECT_TOKEN,
    useExisting: LotRepository,
    scope: Scope.REQUEST,
  },
];
