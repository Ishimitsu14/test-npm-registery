import { ValueObjectAtomicValue } from '@ddd/domain';
import { PageableResult, QueryResult } from '@ddd/specifications';
import { CoreSchema } from '@schema/core';

export class CommonResourceMapper {
  // PAGINATION

  toQueryResult<T extends ValueObjectAtomicValue>(data: QueryResult<any, T>): CoreSchema.WithPaginationResult<T>;
  toQueryResult<T extends ValueObjectAtomicValue, K>(data: QueryResult<any, T>, mapper: (item: T) => K): CoreSchema.WithPaginationResult<K>;
  toQueryResult<T extends ValueObjectAtomicValue, K>(data: QueryResult<any, T>, mapper?: (item: T) => K): CoreSchema.WithPaginationResult<K> {
    return {
      total: data.count,
      items: mapper ? data.items.map(mapper) : (data.items as any as K[]),
    };
  }

  toPagination<T extends ValueObjectAtomicValue>(data: PageableResult<T>): CoreSchema.WithPaginationResult<T>;
  toPagination<T extends ValueObjectAtomicValue, K>(data: PageableResult<T>, mapper: (item: T) => K): CoreSchema.WithPaginationResult<K>;
  toPagination<T extends ValueObjectAtomicValue>(data: PageableResult<T>, mapper?: (item: T) => any): CoreSchema.WithPaginationResult<any> {
    return {
      total: data.count,
      items: mapper ? data.items.map(mapper) : data.items,
    };
  }

  createPagination<T>(items: T[], total: number): CoreSchema.WithPaginationResult<T> {
    return {
      total,
      items,
    };
  }
}
