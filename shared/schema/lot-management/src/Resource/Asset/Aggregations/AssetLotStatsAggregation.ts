import { CoreSchema } from '@schema/core';

import { AssetKey } from '../AssetPK';

export interface AssetLotStatsAggregation extends CoreSchema.Resource<'asset_lot_stats_aggregation'> {
  primaryKey: AssetKey;

  averageFdv: string;
  lotSellCount: number;
  lotBuyCount: number;
  lotSellCvSum: string;
  lotBuyCvSum: string;
}
