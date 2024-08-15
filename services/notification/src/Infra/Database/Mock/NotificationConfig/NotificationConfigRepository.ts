import { MockRepository } from '@shared/db';

import { INotificationConfigRepository, NotificationConfig } from '../../../../Domain';

export class NotificationConfigRepository extends MockRepository<NotificationConfig> implements INotificationConfigRepository {
  readonly EntityType = NotificationConfig;
}
