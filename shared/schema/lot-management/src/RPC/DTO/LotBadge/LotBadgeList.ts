import { CoreSchema } from '@schema/core';

import { LotBadge, LotBadgeKey } from '../../../Resource';

export namespace LotBadgeList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: LotBadgeKey['id'][];
  }>;

  export type Include = CoreSchema.Include<LotBadge, {}>;

  export type Sortable = {};

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<LotBadge> & CoreSchema.WithIncludeLinks<Include>;
}
