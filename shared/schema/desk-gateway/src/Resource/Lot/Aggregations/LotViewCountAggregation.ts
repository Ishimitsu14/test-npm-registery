import { CoreSchema } from '@schema/core';

export interface LotViewCountAggregation extends CoreSchema.Resource<'lot_view_count_aggregation'> {
  id: number;
  count: number;
}
