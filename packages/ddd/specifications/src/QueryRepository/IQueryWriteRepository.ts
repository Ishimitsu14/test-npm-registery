import { Entity } from '@ddd/domain';

import { Pageable } from '../pageable';
import { Query } from '../query';
import { Sortable } from '../sortable';
import { Specification } from '../specifications';

export interface QueryRemoveOptions<TEntity extends Entity> {
  specifications?: Specification<TEntity> | Specification<TEntity>[];
  sortable?: Sortable<TEntity> | Sortable<TEntity>[];
  pageable?: Pageable;
}

export interface IQueryWriteRepository<TEntity extends Entity> {
  removeByQuery(query: Query<TEntity>): void;
  removeByQuery(options: QueryRemoveOptions<TEntity>): void;
  removeByQuery(query: Query<TEntity>, options: QueryRemoveOptions<TEntity>): void;
}
