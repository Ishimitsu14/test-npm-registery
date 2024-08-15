import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { INotificationRequestRepository, NotificationRequest, NotificationRequestPK } from '../../../../Domain';
import { NotificationRequestSnapshot } from './Snapshots';

export class NotificationRequestRepository extends MikroOrmRepository<NotificationRequest, NotificationRequestSnapshot> implements INotificationRequestRepository {
  readonly EntityType = NotificationRequest;
  readonly SnapshotType = NotificationRequestSnapshot;

  async generateNextPK(): Promise<NotificationRequestPK> {
    return NotificationRequestPK.create(v4());
  }
}
