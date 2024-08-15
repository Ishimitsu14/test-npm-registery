import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { FeedbackCreatedAtSortable } from '../../../../../Domain';

@RegisterSortableResolver(FeedbackCreatedAtSortable)
export class FeedbackCreatedAtSortableResolver extends MockSortableResolver<FeedbackCreatedAtSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
