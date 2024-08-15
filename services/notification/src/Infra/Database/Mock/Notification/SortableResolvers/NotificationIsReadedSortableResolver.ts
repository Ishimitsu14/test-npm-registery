import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { NotificationIsReadedSortable } from '../../../../../Domain';

@RegisterSortableResolver(NotificationIsReadedSortable)
export class NotificationIsReadedSortableResolver extends MockSortableResolver<NotificationIsReadedSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
