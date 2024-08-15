import { ModuleMetadata, Scope } from '@nestjs/common';

import { FAVORITE_LOT_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { FavoriteLotRepository } from './FavoriteLotRepository';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const FAVORITE_LOT_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: FAVORITE_LOT_REPOSITORY_INJECT_TOKEN,
    useClass: FavoriteLotRepository,
    scope: Scope.REQUEST,
  },
];
