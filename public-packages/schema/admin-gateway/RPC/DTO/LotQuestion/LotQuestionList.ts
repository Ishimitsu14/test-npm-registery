import { CoreSchema } from '@ishimitsu-org/schema-core';

import { LotKey, LotQuestion, LotQuestionKey, LotQuestionStatus } from '../../../Resource';

export type LotQuestionListFilter = CoreSchema.CompositeFilter<{
  id?: LotQuestionKey['id'][];

  lot?: LotKey['id'][];
  status?: LotQuestionStatus[];
}>;

export type LotQuestionListInclude = CoreSchema.Include<LotQuestion, {}>;

export type LotQuestionListSortable = {
  createdAt?: CoreSchema.SortableValue;
};

export type LotQuestionListPayload =
  CoreSchema.WithFilter<LotQuestionListFilter>
  & CoreSchema.WithInclude<LotQuestionListInclude>
  & CoreSchema.WithSortable<LotQuestionListSortable>
  & CoreSchema.WithPagination;

export type LotQuestionListResult =
  CoreSchema.WithPaginationResult<LotQuestion>
  & CoreSchema.WithIncludeLinks<LotQuestionListInclude>;
