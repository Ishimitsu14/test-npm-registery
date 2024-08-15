import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Notification } from '../Notification';

export interface INotificationRepository extends IRepository<Notification>, IQueryRepository<Notification> {}
