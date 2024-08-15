import { CoreSchema } from '@schema/core';

import { AssetCreateRequest, AssetCreateRequestKey } from '../../../Resource';

export namespace AssetCreateRequestList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: AssetCreateRequestKey['id'][];
  }>;

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<AssetCreateRequest>;
}
