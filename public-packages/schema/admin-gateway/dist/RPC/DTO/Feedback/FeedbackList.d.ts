import { CoreSchema } from '@schema/core';
import { Feedback } from '../../../Resource';
export declare namespace FeedbackList {
    type Sortable = {
        rating?: CoreSchema.SortableValue;
        createdAt?: CoreSchema.SortableValue;
    };
    type Payload = CoreSchema.WithPagination & CoreSchema.WithSortable<Sortable>;
    type Result = CoreSchema.WithPaginationResult<Feedback>;
}
export type FeedbackListSortable = {
    rating?: CoreSchema.SortableValue;
    createdAt?: CoreSchema.SortableValue;
};
export type FeedbackListPayload = CoreSchema.WithPagination & CoreSchema.WithSortable<FeedbackListSortable>;
export type FeedbackListResult = CoreSchema.WithPaginationResult<Feedback>;
