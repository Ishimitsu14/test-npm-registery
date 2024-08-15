import { Entity } from '../../domain';
import { Pageable } from '../pageable';
import { Sortable } from '../sortable';
import { Specification } from '../specifications';
import { mapManyArray } from '../utils';
import { Query } from './Query';

export class QueryBuilder<TEntity extends Entity> {
  private _specs: Specification<TEntity>[] = [];
  private _sorts: Sortable<TEntity>[] = [];
  private _pageable: Pageable = Pageable.defaults();

  addSpec(...specs: (Specification<TEntity> | Specification<TEntity>[])[]) {
    this._specs.push(...mapManyArray(specs));
  }

  addSortable(...sorts: (Sortable<TEntity> | Sortable<TEntity>[])[]) {
    this._sorts.push(...mapManyArray(sorts));
  }

  addPageable(pageable: Pageable) {
    this._pageable = pageable;
  }

  build(): Query<TEntity> {
    return null;
  }
}
