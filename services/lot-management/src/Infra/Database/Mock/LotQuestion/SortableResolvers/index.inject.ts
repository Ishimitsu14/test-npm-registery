import { ModuleMetadata } from '@nestjs/common';

import { LotQuestionCreatedAtSortableResolver } from './LotQuestionCreatedAtSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [LotQuestionCreatedAtSortableResolver];
