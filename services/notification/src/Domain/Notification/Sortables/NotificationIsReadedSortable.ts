import { Sortable } from '@ddd/specifications';

import { Notification } from '../Notification';

export class NotificationIsReadedSortable extends Sortable<Notification> {
  protected initialize(): void {
    this.addSort((item) => item.isReaded);
  }
}
