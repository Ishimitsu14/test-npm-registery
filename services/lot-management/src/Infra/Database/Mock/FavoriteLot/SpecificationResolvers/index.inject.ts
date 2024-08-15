import { ModuleMetadata } from '@nestjs/common';

import { FavoriteLotByUserSpecficationResolver } from './FavoriteLotByUserSpecficationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [FavoriteLotByUserSpecficationResolver];
