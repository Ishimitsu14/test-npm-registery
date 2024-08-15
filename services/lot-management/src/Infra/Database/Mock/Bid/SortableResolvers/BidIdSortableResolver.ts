import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { BidIdSortable } from '../../../../../Domain';

@RegisterSortableResolver(BidIdSortable)
export class BidIdSortableResolver extends MockSortableResolver<BidIdSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
