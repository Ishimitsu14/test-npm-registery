import { ModuleMetadata, Scope } from '@nestjs/common';
import { BID_REPOSITORY_INJECT_TOKEN } from 'services/lot-management/src/Application';

import { BidRepository } from './BidRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const BID_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: BidRepository,
    useClass: BidRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: BID_REPOSITORY_INJECT_TOKEN,
    useClass: BidRepository,
    scope: Scope.REQUEST,
  },
];
