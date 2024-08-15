import { CoreSchema } from '@schema/core';

import { Bid, BidKey, BidMakerKey, BidStatus } from '../../../Resource';
import { LotList } from '../Lot';

export namespace BidList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: BidKey['id'][];

    status?: BidStatus[];
    bidMaker?: BidMakerKey['userId'][];

    lot?: LotList.Filter;
  }>;

  export type Include = CoreSchema.Include<
    Bid,
    {
      lot: LotList.Include;
    }
  >;

  export type Sortable = {
    id?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<Bid> & CoreSchema.WithIncludeLinks<Include>;
}
