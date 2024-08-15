import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { INotificationRequestRepository, NotificationRequest, NotificationRequestPK } from '../../../../Domain';

export class NotificationRequestRepository extends MockRepository<NotificationRequest> implements INotificationRequestRepository {
  readonly EntityType = NotificationRequest;

  async generateNextPK(): Promise<NotificationRequestPK> {
    return NotificationRequestPK.create(v4());
  }
}
