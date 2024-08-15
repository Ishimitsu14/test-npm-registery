import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { FeedbackRatingSortable } from '../../../../../Domain';

@RegisterSortableResolver(FeedbackRatingSortable)
export class FeedbackRatingSortableResolver extends MockSortableResolver<FeedbackRatingSortable> {
  setup() {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
