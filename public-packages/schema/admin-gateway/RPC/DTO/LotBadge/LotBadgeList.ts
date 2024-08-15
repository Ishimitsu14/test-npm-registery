import { CoreSchema } from '@ishimitsu-org/schema-core';

import { LotBadge, LotBadgeKey } from '../../../Resource';

export type LotBadgeListFilter = CoreSchema.CompositeFilter<{
  id?: LotBadgeKey['id'][];
}>;

export type LotBadgeListInclude = CoreSchema.Include<LotBadge, {}>;

export type LotBadgeListSortable = {};

export type LotBadgeListPayload =
  CoreSchema.WithFilter<LotBadgeListFilter>
  & CoreSchema.WithInclude<LotBadgeListInclude>
  & CoreSchema.WithSortable<LotBadgeListSortable>
  & CoreSchema.WithPagination;

export type LotBadgeListResult =
  CoreSchema.WithPaginationResult<LotBadge>
  & CoreSchema.WithIncludeLinks<LotBadgeListInclude>;
