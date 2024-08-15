import { ModuleMetadata } from '@nestjs/common';

import { FeedbackCreatedAtSortableResolver } from './FeedbackCreatedAtSortableResolver';
import { FeedbackRatingSortableResolver } from './FeedbackRatingSortableResolver';

export const SORTABLE_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [FeedbackCreatedAtSortableResolver, FeedbackRatingSortableResolver];
