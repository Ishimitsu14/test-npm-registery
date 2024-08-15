import { CoreSchema } from '@ishimitsu-org/schema-core';

import {
  AssetTier,
  AssetVertical,
  Lot,
  LotKey,
  LotQuestion,
  LotReassignmentType,
  LotStatus,
  LotTotalBidsCountAggregation,
  LotTransactionStatsAggregation,
  LotType,
  TradeDirection,
  User,
  UserKey,
} from '../../../Resource';
import { AssetListFilter, AssetListInclude } from '../Asset';
import { BidListFilter } from '../Bid';
import { DealListFilter } from '../Deal';

export type LotListFilter = CoreSchema.CompositeFilter<{
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
  onlyMy?: boolean;
  offerMaker?: UserKey['id'][];

  asset?: AssetListFilter;
  bid?: BidListFilter;
  deal?: DealListFilter;
}>;

export type LotListInclude = CoreSchema.Include<
  Lot,
  {
    asset: AssetListInclude;
    lotTotalBidsCountAggregation: LotTotalBidsCountAggregation;
    lotTransactionStatsAggregation: LotTransactionStatsAggregation;
    offerMaker: User;
    lotQuestion: LotQuestion;
  }
>;

export type LotListSortable = {
  id?: CoreSchema.SortableValue;
  badge?: CoreSchema.SortableValue;
};

export type LotListPayload =
  CoreSchema.WithFilter<LotListFilter>
  & CoreSchema.WithInclude<LotListInclude>
  & CoreSchema.WithSortable<LotListSortable>
  & CoreSchema.WithPagination;

export type LotListResult = CoreSchema.WithPaginationResult<Lot> & CoreSchema.WithIncludeLinks<LotListInclude>;
