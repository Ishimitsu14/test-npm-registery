import { CoreSchema } from '@schema/core';

import { FavoriteLot, FavoriteLotKey } from '../../../Resource';

export type FavoriteLotListFilter = CoreSchema.CompositeFilter<{
    id?: FavoriteLotKey['id'][];
  }>;
export type FavoriteLotListInclude = CoreSchema.Include<FavoriteLot, {}>;
export type FavoriteLotListSortable = {};
export type FavoriteLotListPayload = CoreSchema.WithFilter<FavoriteLotListFilter> & CoreSchema.WithInclude<FavoriteLotListInclude> & CoreSchema.WithSortable<FavoriteLotListSortable> & CoreSchema.WithPagination;
export type FavoriteLotListResult = CoreSchema.WithPaginationResult<FavoriteLot> & CoreSchema.WithIncludeLinks<FavoriteLotListInclude>;
