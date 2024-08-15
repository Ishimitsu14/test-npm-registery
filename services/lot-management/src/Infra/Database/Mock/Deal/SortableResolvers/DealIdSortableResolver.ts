import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { DealIdSortable } from '../../../../../Domain';

@RegisterSortableResolver(DealIdSortable)
export class DealIdSortableResolver extends MockSortableResolver<DealIdSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
