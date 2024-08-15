import { ModuleMetadata, Scope } from '@nestjs/common';

import { USER_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';
import { UserRepository } from './UserRepository';

export const USER_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: UserRepository,
    useClass: UserRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: USER_REPOSITORY_INJECT_TOKEN,
    useExisting: UserRepository,
    scope: Scope.REQUEST,
  },
];
