import { CoreSchema } from '@schema/core';

import { AssetFaq, AssetFaqKey, AssetKey } from '../../../Resource';


export type AssetFaqListFilter = CoreSchema.CompositeFilter<{
  id?: AssetFaqKey['id'][];

  asset?: AssetKey['id'][];
}>;

export type AssetFaqListInclude = CoreSchema.Include<AssetFaq, {}>;

export type AssetFaqListSortable = {};

export type AssetFaqListPayload =
  CoreSchema.WithFilter<AssetFaqListFilter>
  & CoreSchema.WithInclude<AssetFaqListInclude>
  & CoreSchema.WithSortable<AssetFaqListSortable>
  & CoreSchema.WithPagination;

export type AssetFaqListResult =
  CoreSchema.WithPaginationResult<AssetFaq>
  & CoreSchema.WithIncludeLinks<AssetFaqListInclude>;
