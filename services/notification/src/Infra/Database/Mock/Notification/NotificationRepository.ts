import { MockRepository } from '@shared/db';

import { INotificationRepository, Notification } from '../../../../Domain';

export class NotificationRepository extends MockRepository<Notification> implements INotificationRepository {
  readonly EntityType = Notification;
}
