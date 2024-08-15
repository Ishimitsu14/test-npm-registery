import { ModuleMetadata, Scope } from '@nestjs/common';

import { FILE_ENTITY_REPOSITORY } from '../../../../Application';
import { FileEntityRepository } from './FileEntityRepository';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const FILE_ENTITY_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: FILE_ENTITY_REPOSITORY,
    useClass: FileEntityRepository,
    scope: Scope.REQUEST,
  },
];
