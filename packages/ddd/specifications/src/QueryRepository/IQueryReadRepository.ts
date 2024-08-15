import { Nullable } from '@ddd/core';
import { Entity } from '@ddd/domain';
import { ReadRepositoryUseFindOptions } from '@ddd/infra';

import { Pageable } from '../pageable';
import { Query, QueryResult } from '../query';
import { Sortable } from '../sortable';
import { Specification } from '../specifications';

export interface QueryRepositoryFirstOptions<TEntity extends Entity> extends ReadRepositoryUseFindOptions {
  specifications?: Specification<TEntity> | Specification<TEntity>[];
  sortable?: Sortable<TEntity> | Sortable<TEntity>[];
  skip?: number;
}

export interface QueryRepositoryFindOptions<TEntity extends Entity> extends ReadRepositoryUseFindOptions {
  specifications?: Specification<TEntity> | Specification<TEntity>[];
  sortable?: Sortable<TEntity> | Sortable<TEntity>[];
  pageable?: Pageable;
}

export interface QueryRepositoryCountOptions<TEntity extends Entity> {
  specifications?: Specification<TEntity> | Specification<TEntity>[];
}

export interface IQueryReadRepository<TEntity extends Entity<any>> {
  first(): Promise<Nullable<TEntity>>;
  first(query: Query<TEntity>): Promise<Nullable<TEntity>>;
  first(options: QueryRepositoryFirstOptions<TEntity>): Promise<Nullable<TEntity>>;
  first(query: Query<TEntity>, options: QueryRepositoryFirstOptions<TEntity>): Promise<Nullable<TEntity>>;

  count(): Promise<number>;
  count(query: Query<TEntity>): Promise<number>;
  count(options: QueryRepositoryCountOptions<TEntity>): Promise<number>;
  count(query: Query<TEntity>, options: QueryRepositoryCountOptions<TEntity>): Promise<number>;

  find(): Promise<QueryResult<TEntity>>;
  find(query: Query<TEntity>): Promise<QueryResult<TEntity>>;
  find(options: QueryRepositoryFindOptions<TEntity>): Promise<QueryResult<TEntity>>;
  find(query: Query<TEntity>, options: QueryRepositoryFindOptions<TEntity>): Promise<QueryResult<TEntity>>;
}
