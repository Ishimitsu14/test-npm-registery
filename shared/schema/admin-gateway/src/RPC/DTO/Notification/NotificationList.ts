import { CoreSchema } from '@schema/core';

import { Notification, NotificationKey, NotificationType } from '../../../Resource';

export type NotificationListFilter = CoreSchema.CompositeFilter<{
    notificationIds?: NotificationKey['notificationId'][];
    type?: NotificationType[];
    isReaded?: boolean;
  }>;
export type NotificationListSortable = {
    isReaded?: CoreSchema.SortableValue;
    createdAt?: CoreSchema.SortableValue;
  };
export type NotificationListPayload = CoreSchema.WithFilter<NotificationListFilter> & CoreSchema.WithPagination & CoreSchema.WithSortable<NotificationListSortable>;
export type NotificationListResult = CoreSchema.WithPaginationResult<Notification>;
