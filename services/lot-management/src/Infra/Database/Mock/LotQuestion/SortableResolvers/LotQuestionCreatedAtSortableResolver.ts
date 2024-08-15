import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { LotQuestionCreatedAtSortable } from '../../../../../Domain';

@RegisterSortableResolver(LotQuestionCreatedAtSortable)
export class LotQuestionCreatedAtSortableResolver extends MockSortableResolver<LotQuestionCreatedAtSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
