import { CoreSchema } from '@schema/core';

import { LotKey } from '../LotKey';

export interface LotViewCountAggregation extends CoreSchema.Resource<'lot_view_count_aggregation'> {
  primaryKey: LotKey;
  count: number;
}
