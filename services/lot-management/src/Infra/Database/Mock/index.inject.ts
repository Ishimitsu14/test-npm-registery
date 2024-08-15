import { ModuleMetadata } from '@nestjs/common';
import { mockInject } from '@shared/db';

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

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mockInject(),
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
