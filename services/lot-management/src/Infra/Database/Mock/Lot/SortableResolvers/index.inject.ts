import { ModuleMetadata } from '@nestjs/common';

import { LotCommonBadgeSortableResolver } from './LotCommonBadgeSortableResolver';
import { LotIdSortableResolver } from './LotIdSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [LotIdSortableResolver, LotCommonBadgeSortableResolver];
