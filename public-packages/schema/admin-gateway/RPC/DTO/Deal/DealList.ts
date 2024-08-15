import { CoreSchema } from '@ishimitsu-org/schema-core';

import { Deal, DealKey, DealStatus, User, UserKey } from '../../../Resource';
import { BidListFilter, BidListInclude } from '../Bid';

export type DealListFilter = CoreSchema.CompositeFilter<{
  id?: DealKey['id'][];

  status?: DealStatus[];
  offerMaker?: UserKey['id'][];
  bidMaker?: UserKey['id'][];

  bid?: BidListFilter;
}>;

export type DealListInclude = CoreSchema.Include<
  Deal,
  {
    bid: BidListInclude;
    bidMaker: User;
    offerMaker: User;
  }
>;

export type DealListSortable = {
  id?: CoreSchema.SortableValue;
};

export type DealListPayload =
  CoreSchema.WithFilter<DealListFilter>
  & CoreSchema.WithInclude<DealListInclude>
  & CoreSchema.WithSortable<DealListSortable>
  & CoreSchema.WithPagination;

export type DealListResult = CoreSchema.WithPaginationResult<Deal> & CoreSchema.WithIncludeLinks<DealListInclude>;
