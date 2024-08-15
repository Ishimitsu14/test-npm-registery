import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { NotificationRequest } from '../NotificationRequest';
import { NotificationRequestPK } from '../NotificationRequestPK';

export interface INotificationRequestRepository extends IRepository<NotificationRequest>, IQueryRepository<NotificationRequest> {
  generateNextPK(): Promise<NotificationRequestPK>;
}
