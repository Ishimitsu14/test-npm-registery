import { ModuleMetadata, Scope } from '@nestjs/common';
import { LOT_QUESTION_REPOSITORY_INJECT_TOKEN } from 'services/lot-management/src/Application';

import { LotQuestionRepository } from './LotQuestionRepository';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const LOT_QUESTION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: LOT_QUESTION_REPOSITORY_INJECT_TOKEN,
    useClass: LotQuestionRepository,
    scope: Scope.REQUEST,
  },
];
