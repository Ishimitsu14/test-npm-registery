import { CoreSchema } from '@schema/core';

import { Bid, BidKey, BidStatus, User } from '../../../Resource';
import { LotListFilter, LotListInclude } from '../Lot';

export type BidListFilter = CoreSchema.CompositeFilter<{
  id?: BidKey['id'][];

  status?: BidStatus[];
  onlyMy?: boolean;
  bidMaker: User['id'][];

  lot?: LotListFilter;
}>;

export type BidListInclude = CoreSchema.Include<
  Bid,
  {
    lot: LotListInclude;
    bidMaker: User;
  }
>;

export type BidListSortable = {
  id?: CoreSchema.SortableValue;
};

export type BidListPayload =
  CoreSchema.WithFilter<BidListFilter>
  & CoreSchema.WithInclude<BidListInclude>
  & CoreSchema.WithSortable<BidListSortable>
  & CoreSchema.WithPagination;

export type BidListResult = CoreSchema.WithPaginationResult<Bid> & CoreSchema.WithIncludeLinks<BidListInclude>;
