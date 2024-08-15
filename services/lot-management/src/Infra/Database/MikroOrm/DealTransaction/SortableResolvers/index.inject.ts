import { ModuleMetadata } from '@nestjs/common';

import { DealTransactionIdSortableResolver } from './DealTransactionIdSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [DealTransactionIdSortableResolver];
