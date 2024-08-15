import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { NotificationIsReadedSortable } from '../../../../../Domain';
import { NotificationSnapshot } from '../Snapshots';

@RegisterSortableResolver(NotificationIsReadedSortable)
export class NotificationIsReadedSortableResolver extends MikroOrmSortableResolver<NotificationIsReadedSortable, NotificationSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        isReaded: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
