import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { DealTransactionIdSortable } from '../../../../../Domain';

@RegisterSortableResolver(DealTransactionIdSortable)
export class DealTransactionIdSortableResolver extends MockSortableResolver<DealTransactionIdSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
