import { MikroOrmRepository } from '@shared/db';

import { INotificationRepository, Notification } from '../../../../Domain';
import { NotificationSnapshot } from './Snapshots';

export class NotificationRepository extends MikroOrmRepository<Notification, NotificationSnapshot> implements INotificationRepository {
  readonly EntityType = Notification;
  readonly SnapshotType = NotificationSnapshot;
}
