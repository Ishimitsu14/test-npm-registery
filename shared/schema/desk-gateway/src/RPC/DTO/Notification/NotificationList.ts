import { CoreSchema } from '@schema/core';

import { Notification, NotificationKey, NotificationType } from '../../../Resource';

export namespace NotificationList {
  export type Filter = CoreSchema.CompositeFilter<{
    notificationIds?: NotificationKey['notificationId'][];
    type?: NotificationType[];
    isReaded?: boolean;
  }>;

  export type Sortable = {
    isReaded?: CoreSchema.SortableValue;
    createdAt?: CoreSchema.SortableValue;
  };

  export type Payload = CoreSchema.WithFilter<Filter> & CoreSchema.WithPagination & CoreSchema.WithSortable<Sortable>;
  export type Result = CoreSchema.WithPaginationResult<Notification>;
}
