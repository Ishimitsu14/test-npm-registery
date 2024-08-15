import { ModuleMetadata } from '@nestjs/common';

import { AssetIdSortableResolver } from './AssetIdSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [AssetIdSortableResolver];
