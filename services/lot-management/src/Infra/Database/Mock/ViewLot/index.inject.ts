import { ModuleMetadata, Scope } from '@nestjs/common';

import { VIEW_LOT_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';
import { ViewLotRepository } from './ViewLotRepository';

export const VIEW_LOT_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: VIEW_LOT_REPOSITORY_INJECT_TOKEN,
    useClass: ViewLotRepository,
    scope: Scope.REQUEST,
  },
];
