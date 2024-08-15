import { CoreSchema } from '@schema/core';

import { LotKey } from '../LotKey';

export interface LotTotalBidsCountAggregation extends CoreSchema.Resource<'lot_total_bids_count_aggregation', LotKey> {
  count: number;
}
