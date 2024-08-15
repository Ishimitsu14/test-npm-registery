import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { NotificationCreatedAtSortable } from '../../../../../Domain';

@RegisterSortableResolver(NotificationCreatedAtSortable)
export class NotificationCreatedAtSortableResolver extends MockSortableResolver<NotificationCreatedAtSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
