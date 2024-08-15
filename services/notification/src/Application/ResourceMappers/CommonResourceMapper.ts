import { ValueObjectAtomicValue } from '@ddd/domain';
import { QueryResult } from '@ddd/specifications';
import { CoreSchema } from '@schema/core';
import { NotificationSchema } from '@schema/notification';

import { NotificationRecipientPK } from '../../Domain';

export class CommonResourceMapper {
  // PAGINATION

  toPagination<T extends ValueObjectAtomicValue>(data: QueryResult<any, T>): CoreSchema.WithPaginationResult<T>;
  toPagination<T extends ValueObjectAtomicValue, K>(data: QueryResult<any, T>, mapper: (item: T, index: number) => K): CoreSchema.WithPaginationResult<K>;
  toPagination<T extends ValueObjectAtomicValue>(data: QueryResult<any, T>, mapper?: (item: T, index: number) => any): CoreSchema.WithPaginationResult<any> {
    return {
      total: data.count,
      items: mapper ? data.items.map(mapper) : data.items,
    };
  }

  toNotificationRecipientPK(domain: NotificationRecipientPK): Required<NotificationSchema.NotificationRecipientPK> {
    return {
      resource: 'notification_recipient_key',
      id: domain.id,
    };
  }
}
