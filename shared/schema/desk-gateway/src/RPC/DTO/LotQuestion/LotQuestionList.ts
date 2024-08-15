import { CoreSchema } from '@schema/core';

import { LotKey, LotQuestion, LotQuestionKey, LotQuestionStatus, User } from '../../../Resource';

export namespace LotQuestionList {
  export type Filter = CoreSchema.CompositeFilter<{
    id?: LotQuestionKey['id'][];

    lot?: LotKey['id'][];
    status?: LotQuestionStatus[];
  }>;

  export type Include = CoreSchema.Include<
    LotQuestion,
    {
      user: User;
    }
  >;

  export type Sortable = {
    createdAt?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithInclude<Include> & CoreSchema.WithSortable<Sortable> & CoreSchema.WithPagination;
  export type Result = CoreSchema.WithPaginationResult<LotQuestion> & CoreSchema.WithIncludeLinks<Include>;
}
