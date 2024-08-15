import { CoreSchema } from '@schema/core';

export class CoreResourceMapper {
  withFilter<TFilter>(filter: TFilter): CoreSchema.WithFilter<TFilter> {
    return {
      filter,
    };
  }

  toPagination<T>(data: CoreSchema.WithPaginationResult<T>): CoreSchema.WithPaginationResult<T>;
  toPagination<T, K>(data: CoreSchema.WithPaginationResult<T>, mapper: (item: T) => K): CoreSchema.WithPaginationResult<K>;
  toPagination<T>(data: CoreSchema.WithPaginationResult<T>, mapper?: (item: T) => any): CoreSchema.WithPaginationResult<any> {
    return {
      total: data.total,
      items: mapper ? data.items.map(mapper) : data.items,
    };
  }

  withPaginationResult<T>(items: T[], total: number): CoreSchema.WithPaginationResult<T>;
  withPaginationResult<T, K>(items: T[], total: number, mapperCallback: (item: T) => K): CoreSchema.WithPaginationResult<K>;
  withPaginationResult<T, K>(items: T[], total: number, mapperCallback?: (item: T) => K): CoreSchema.WithPaginationResult<K | T> {
    const outputItems = typeof mapperCallback === 'function' ? items.map((item) => mapperCallback(item)) : items;

    return {
      total,
      items: outputItems,
    };
  }

  withIncludeLinks<TInclude extends CoreSchema.Include<any, any>>(links: CoreSchema.IncludeLink<TInclude>[]): CoreSchema.WithIncludeLinks<TInclude>;
  withIncludeLinks<TInclude extends CoreSchema.Include<any, any>, KInclude extends CoreSchema.Include<any, any>>(
    links: CoreSchema.IncludeLink<TInclude>[],
    mapperCallback: (link: CoreSchema.IncludeLink<TInclude>[]) => CoreSchema.IncludeLink<TInclude>[],
  ): CoreSchema.WithIncludeLinks<KInclude>;
  withIncludeLinks<TInclude extends CoreSchema.Include<any, any>, KInclude extends CoreSchema.Include<any, any>>(
    links: CoreSchema.IncludeLink<TInclude>[],
    mapperCallback?: (link: CoreSchema.IncludeLink<TInclude>[]) => CoreSchema.IncludeLink<KInclude>[],
  ): CoreSchema.WithIncludeLinks<KInclude> {
    return {
      links,
    };
  }
}
