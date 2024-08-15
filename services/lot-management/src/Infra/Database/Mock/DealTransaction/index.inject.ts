import { ModuleMetadata, Scope } from '@nestjs/common';

import { DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { DealTransactionRepository } from './DealTransactionRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const DEAL_TRANSACTION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: DealTransactionRepository,
    useClass: DealTransactionRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN,
    useClass: DealTransactionRepository,
    scope: Scope.REQUEST,
  },
];
