import { ModuleMetadata } from '@nestjs/common';

import { AssetFaqByAssetSpecficationResolver } from './AssetFaqByAssetSpecficationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [AssetFaqByAssetSpecficationResolver];
