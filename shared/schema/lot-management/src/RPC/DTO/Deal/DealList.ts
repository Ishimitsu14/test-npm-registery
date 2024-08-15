import { CoreSchema } from '@schema/core';

import { BidMakerKey, Deal, DealKey, DealStatus, OfferMakerKey } from '../../../Resource';
import { BidList } from '../Bid';

export namespace DealList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: DealKey['id'][];

    status?: DealStatus[];
    offerMaker?: OfferMakerKey['userId'][];
    bidMaker?: BidMakerKey['userId'][];

    bid?: BidList.Filter;
  }>;

  export type Include = CoreSchema.Include<
    Deal,
    {
      bid: BidList.Include;
    }
  >;

  export type Sortable = {
    id?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<Deal> & CoreSchema.WithIncludeLinks<Include>;
}
