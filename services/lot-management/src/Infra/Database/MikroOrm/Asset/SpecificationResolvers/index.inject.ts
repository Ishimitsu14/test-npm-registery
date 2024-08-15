import { ModuleMetadata } from '@nestjs/common';

import { AssetBySearchSpecificationResolver } from './AssetBySearchSpecificationResolver';
import { AssetByStatusSpecificationResolver } from './AssetByStatusSpecificationResolver';
import { AssetByTierSpecificationResolver } from './AssetByTierSpecificationResolver';
import { AssetByVerticalsSpecificationResolver } from './AssetByVerticalsSpecificationResolver';
import { AssetMatchesLotSpecificationResolver } from './AssetMatchesLotSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AssetBySearchSpecificationResolver,
  AssetByTierSpecificationResolver,
  AssetByVerticalsSpecificationResolver,
  AssetMatchesLotSpecificationResolver,
  AssetByStatusSpecificationResolver,
];
