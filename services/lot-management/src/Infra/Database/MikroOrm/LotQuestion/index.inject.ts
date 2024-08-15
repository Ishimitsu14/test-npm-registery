import { ModuleMetadata, Scope } from '@nestjs/common';

import { LOT_QUESTION_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { LotQuestionRepository } from './LotQuestionRepository';
import { SORTABLE_RESOLVERS_INJECT_PROVIDERS } from './SortableResolvers';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const LOT_QUESTION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  ...SORTABLE_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: LOT_QUESTION_REPOSITORY_INJECT_TOKEN,
    useClass: LotQuestionRepository,
    scope: Scope.REQUEST,
  },
];
