import { ModuleMetadata } from '@nestjs/common';

import { AssetLotStatsAggregatorResolver } from './AssetLotStatsAggregatorResolver';
import { LotTotalBidsCountAggregatorResolver } from './LotTotalBidsCountAggregatorResolver';
import { LotTransactionStatsAggregatorResolver } from './LotTransactionStatsAggregatorResolver';
import { LotViewCountAggregatorResolver } from './LotViewCountAggregatorResolver';

export const AGGREGATOR_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  AssetLotStatsAggregatorResolver,
  LotTotalBidsCountAggregatorResolver,
  LotTransactionStatsAggregatorResolver,
  LotViewCountAggregatorResolver,
];
