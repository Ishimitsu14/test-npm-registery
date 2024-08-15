import { MikroOrmRepository } from '@shared/db';

import { INotificationConfigRepository, NotificationConfig } from '../../../../Domain';
import { NotificationConfigSnapshot } from './Snapshots';

export class NotificationConfigRepository extends MikroOrmRepository<NotificationConfig, NotificationConfigSnapshot> implements INotificationConfigRepository {
  readonly EntityType = NotificationConfig;
  readonly SnapshotType = NotificationConfigSnapshot;
}
