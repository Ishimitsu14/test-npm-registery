import { ModuleMetadata, Scope } from '@nestjs/common';

import { DEAL_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { DealRepository } from './DealRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const DEAL_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: DealRepository,
    useClass: DealRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: DEAL_REPOSITORY_INJECT_TOKEN,
    useClass: DealRepository,
    scope: Scope.REQUEST,
  },
];
