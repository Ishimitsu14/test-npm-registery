import { ModuleMetadata } from '@nestjs/common';

import { BidIdSortableResolver } from './BidIdSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [BidIdSortableResolver];
