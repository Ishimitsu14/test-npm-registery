import { ModuleMetadata, Scope } from '@nestjs/common';

import { FEEDBACK_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { FeedbackRepository } from './FeedbackRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';

export const FEEDBACK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: FEEDBACK_REPOSITORY_INJECT_TOKEN,
    useClass: FeedbackRepository,
    scope: Scope.REQUEST,
  },
];
