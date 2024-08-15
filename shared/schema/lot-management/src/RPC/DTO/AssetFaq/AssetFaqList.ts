import { CoreSchema } from '@schema/core';

import { AssetFaq, AssetFaqKey, AssetKey } from '../../../Resource';

export namespace AssetFaqList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: AssetFaqKey['id'][];

    asset?: AssetKey['id'][];
  }>;

  export type Include = CoreSchema.Include<AssetFaq, {}>;

  export type Sortable = {};

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<AssetFaq> & CoreSchema.WithIncludeLinks<Include>;
}
