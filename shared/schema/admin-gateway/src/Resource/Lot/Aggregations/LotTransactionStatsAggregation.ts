import { CoreSchema } from '@schema/core';

import { LotKey } from '../LotKey';

export interface LotTransactionStatsAggregation extends CoreSchema.Resource<'lot_transaction_stats_aggregation', LotKey> {
  executed: string;
  reserved: string;
  available: string;
  total: string;
}
