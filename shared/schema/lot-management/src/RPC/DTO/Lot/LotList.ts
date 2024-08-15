import { CoreSchema } from '@schema/core';

import {
  AssetTier,
  AssetVertical,
  Lot,
  LotKey,
  LotReassignmentType,
  LotStatus,
  LotTotalBidsCountAggregation,
  LotTransactionStatsAggregation,
  LotType,
  LotViewCountAggregation,
  OfferMakerKey,
  TradeDirection,
} from '../../../Resource';
import { AssetList } from '../Asset';
import { BidList } from '../Bid';
import { DealList } from '../Deal';
import { LotQuestionList } from '../LotQuestion';

export namespace LotList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: LotKey['id'][];

    search?: string;
    type?: LotType[];
    status?: LotStatus[];
    verticals?: AssetVertical[];
    tier?: AssetTier[];
    direction?: TradeDirection;
    minContractValue?: number;
    maxContractValue?: number;
    minBidSize?: number;
    maxBidSize?: number;
    minTargetValuation?: number;
    maxTargetValuation?: number;
    minCreatedAt?: number;
    maxCreatedAt?: number;
    reassignmentType?: LotReassignmentType[];
    isHot?: boolean;
    offerMaker?: OfferMakerKey['userId'][];

    asset?: AssetList.Filter;
    bid?: BidList.Filter;
    deal?: DealList.Filter;
  }>;

  export type Include = CoreSchema.Include<
    Lot,
    {
      asset: AssetList.Include;
      lotTotalBidsCountAggregation: LotTotalBidsCountAggregation;
      lotTransactionStatsAggregation: LotTransactionStatsAggregation;
      lotViewCountAggregation: LotViewCountAggregation;
      lotQuestion: LotQuestionList.Include;
    }
  >;

  export type Sortable = {
    id?: CoreSchema.SortableValue;
    badge?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<Lot> & CoreSchema.WithIncludeLinks<Include>;
}
