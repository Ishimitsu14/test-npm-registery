import { ModuleMetadata, Scope } from '@nestjs/common';

import { USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';
import { UserRoleRepository } from './UserRoleRepository';

export const USER_ROLE_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: UserRoleRepository,
    useClass: UserRoleRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: USER_ROLE_REPOSITORY_INJECT_TOKEN,
    useExisting: UserRoleRepository,
    scope: Scope.REQUEST,
  },
];
