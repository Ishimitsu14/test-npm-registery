import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { LotIdSortable } from '../../../../../Domain';

@RegisterSortableResolver(LotIdSortable)
export class LotIdSortableResolver extends MockSortableResolver<LotIdSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
