import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { NotificationCreatedAtSortable } from '../../../../../Domain';
import { NotificationSnapshot } from '../Snapshots';

@RegisterSortableResolver(NotificationCreatedAtSortable)
export class NotificationCreatedAtSortableResolver extends MikroOrmSortableResolver<NotificationCreatedAtSortable, NotificationSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        createdAt: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
