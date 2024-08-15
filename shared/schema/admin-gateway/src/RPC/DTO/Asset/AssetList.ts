import { CoreSchema } from '@schema/core';

import {
  Asset,
  AssetFaq,
  AssetKey,
  AssetLotStatsAggregation,
  AssetStatus,
  AssetTier,
  AssetVertical,
} from '../../../Resource';
import { BidListFilter } from '../Bid';
import { DealListFilter } from '../Deal';
import { LotListFilter } from '../Lot';

export type AssetListFilter = CoreSchema.CompositeFilter<{
  id?: AssetKey['id'][];

  search?: string;
  withLots?: boolean;
  tier?: AssetTier[];
  verticals?: AssetVertical[];
  status?: AssetStatus[];

  lot?: LotListFilter;
  bid?: BidListFilter;
  deal?: DealListFilter;
}>;

export type AssetListInclude = CoreSchema.Include<
  Asset,
  {
    assetLotStatsAggregation: AssetLotStatsAggregation;
    assetFaq: AssetFaq;
  }
>;

export type AssetListSortable = {
  id?: CoreSchema.SortableValue;
};

export type AssetListPayload =
  CoreSchema.WithPagination
  & CoreSchema.WithFilter<AssetListFilter>
  & CoreSchema.WithInclude<AssetListInclude>
  & CoreSchema.WithSortable<AssetListSortable>;

export type AssetListResult = CoreSchema.WithPaginationResult<Asset> & CoreSchema.WithIncludeLinks<AssetListInclude>;
