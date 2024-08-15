import { ModuleMetadata } from '@nestjs/common';
import { LotManagementConfig } from '@shared/config';
import { mikroOrmInject } from '@shared/db';

import { ASSET_INJECT_PROVIDERS } from './Asset';
import { ASSET_FAQ_INJECT_PROVIDERS } from './AssetFaq';
import { BID_INJECT_PROVIDERS } from './Bid';
import { DEAL_INJECT_PROVIDERS } from './Deal';
import { DEAL_TRANSACTION_INJECT_PROVIDERS } from './DealTransaction';
import { FAVORITE_LOT_INJECT_PROVIDERS } from './FavoriteLot';
import { LOT_INJECT_PROVIDERS } from './Lot';
import { LOT_BADGE_INJECT_PROVIDERS } from './LotBadge';
import { LOT_QUESTION_INJECT_PROVIDERS } from './LotQuestion';
import { VIEW_LOT_INJECT_PROVIDERS } from './ViewLot';

export const MIKRO_ORM_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mikroOrmInject({
    url: LotManagementConfig.database.url,
    synchronize: LotManagementConfig.database.useSync,
    imports: import('./snapshots.export'),
    useSSL: LotManagementConfig.database.useSSL,
    debug: LotManagementConfig.logger.level === 'debug',
  }),
  ...ASSET_INJECT_PROVIDERS,
  ...BID_INJECT_PROVIDERS,
  ...DEAL_INJECT_PROVIDERS,
  ...DEAL_TRANSACTION_INJECT_PROVIDERS,
  ...LOT_INJECT_PROVIDERS,
  ...FAVORITE_LOT_INJECT_PROVIDERS,
  ...LOT_QUESTION_INJECT_PROVIDERS,
  ...ASSET_FAQ_INJECT_PROVIDERS,
  ...VIEW_LOT_INJECT_PROVIDERS,
  ...LOT_BADGE_INJECT_PROVIDERS,
];
