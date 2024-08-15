import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { NotificationConfig } from '../NotificationConfig';

export interface INotificationConfigRepository extends IRepository<NotificationConfig>, IQueryRepository<NotificationConfig> {}
