import { ModuleMetadata } from '@nestjs/common';

import { DealIdSortableResolver } from './DealIdSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [DealIdSortableResolver];
