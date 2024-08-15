import { CoreSchema } from '@schema/core';

import { Notification, NotificationRecipientPK, NotificationRequestPK, NotificationType } from '../../../Resource';

export namespace NotificationList {
  export type Filter = CoreSchema.CompositeFilter<{
    notificationIds?: NotificationRequestPK['notificationRequestId'][];
    recipientsIds?: NotificationRecipientPK['id'][];
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
