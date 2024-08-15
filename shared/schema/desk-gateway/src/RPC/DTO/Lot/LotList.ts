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
  TradeDirection,
  User,
  UserKey,
} from '../../../Resource';
import { AssetListFilter, AssetListInclude } from '../Asset';
import { BidListFilter } from '../Bid';
import { DealList } from '../Deal';
import { LotQuestionList } from '../LotQuestion';

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
  deal?: DealList.Filter;
}>;
export type LotListInclude = CoreSchema.Include<
  Lot,
  {
    asset: AssetListInclude;
    lotTotalBidsCountAggregation: LotTotalBidsCountAggregation;
    lotTransactionStatsAggregation: LotTransactionStatsAggregation;
    lotViewCountAggregation: LotViewCountAggregation;
    offerMaker: User;
    lotQuestion: LotQuestionList.Include;
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
