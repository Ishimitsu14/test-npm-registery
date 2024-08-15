import { Sortable } from '@ddd/specifications';

import { Notification } from '../Notification';

export class NotificationCreatedAtSortable extends Sortable<Notification> {
  protected initialize(): void {
    this.addSort((item) => item.createdAt);
  }
}
