import { ModuleMetadata, Scope } from '@nestjs/common';

import { ASSET_FAQ_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { AssetFaqRepository } from './AssetFaqRepository';
import { SPECIFICATION_RESOLVERS_INJECT_PROVIDERS } from './SpecificationResolvers';

export const ASSET_FAQ_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...SPECIFICATION_RESOLVERS_INJECT_PROVIDERS,
  {
    provide: ASSET_FAQ_REPOSITORY_INJECT_TOKEN,
    useClass: AssetFaqRepository,
    scope: Scope.REQUEST,
  },
];
