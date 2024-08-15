import { CoreSchema } from '@schema/core';

import { Feedback } from '../../Resource';

export namespace FeedbackList {
  export type Sortable = {
    rating?: CoreSchema.SortableValue;
    createdAt?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithPagination & CoreSchema.WithSortable<Sortable>;

  export type Result = CoreSchema.WithPaginationResult<Feedback>;
}
