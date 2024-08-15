import { CoreSchema } from '@schema/core';

import { Asset, AssetFaq, AssetKey, AssetLotStatsAggregation, AssetStatus, AssetTier, AssetVertical } from '../../../Resource';
import { BidList } from '../Bid';
import { DealList } from '../Deal';
import { LotList } from '../Lot';

export namespace AssetList {
  export type Filter = CoreSchema.CompositeFilter<{
    id: AssetKey['id'][];

    search?: string;
    withLots?: boolean;
    tier?: AssetTier[];
    verticals?: AssetVertical[];
    status?: AssetStatus[];

    lot?: LotList.Filter;
    bid?: BidList.Filter;
    deal?: DealList.Filter;
  }>;

  export type Include = CoreSchema.Include<
    Asset,
    {
      assetLotStatsAggregation: AssetLotStatsAggregation;
      assetFaq: AssetFaq;
    }
  >;

  export type Sortable = {
    id?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithPagination & CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable>;
  export type Result = CoreSchema.WithPaginationResult<Asset> & CoreSchema.WithIncludeLinks<Include>;
}
