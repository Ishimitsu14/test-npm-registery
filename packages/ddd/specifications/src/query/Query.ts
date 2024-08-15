import { ListCollection, Nullable } from '@ddd/core';
import { Entity, EntityConstructor, ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { Pageable } from '../pageable';
import { Sortable } from '../sortable';
import { Specification } from '../specifications';
import { combineSpecifications } from '../specifications/helpers';

export class Query<TEntity extends Entity<any>> extends ValueObject {
  static create<TEntity extends Entity<any>>(): Query<TEntity>;
  static create<TEntity extends Entity<any>>(type: EntityConstructor<TEntity>): Query<TEntity>;
  static create<TEntity extends Entity<any>>(type?: EntityConstructor<TEntity>): Query<TEntity> {
    return new Query<TEntity>([], [], Pageable.defaults());
  }

  static fromRaw<TEntity extends Entity>(specs: Specification<TEntity>[], sorts: Sortable<TEntity>[], pageable: Pageable) {
    return new Query(specs, sorts, pageable);
  }

  readonly rootSpecification: Specification<TEntity>;

  private constructor(
    readonly specs: Specification<TEntity>[],
    readonly sorts: Sortable<TEntity>[],
    readonly pageable: Pageable,
  ) {
    super();

    this.rootSpecification = combineSpecifications(specs);
  }

  get isLockedLocalSpecify() {
    return this.rootSpecification.isLockedLocalSpecify;
  }

  isSatified(items: TEntity | TEntity[]) {
    return this.rootSpecification.isSatisfied(items);
  }

  addSpecification(specs: Specification<TEntity> | Specification<TEntity>[]) {
    const collection = new ListCollection(this.specs);

    const _specs = Array.isArray(specs) ? specs : [specs];

    for (const spec of _specs) {
      collection.add(spec);
    }

    return new Query(collection.items, this.sorts, this.pageable);
  }

  addPageable(pageable?: Nullable<Pageable>): Query<TEntity>;
  addPageable(skip?: Nullable<number>, limit?: Nullable<number>): Query<TEntity>;
  addPageable(arg0: Pageable | Nullable<number>, arg1?: Nullable<number>): Query<TEntity> {
    const pageable = Pageable.isExtends(arg0) ? arg0 : Pageable.create(arg0, arg1);

    return new Query(this.specs, this.sorts, pageable);
  }

  addSortable(sortable: Sortable<TEntity> | Sortable<TEntity>[]) {
    const collection = new ListCollection(this.sorts);

    const _sorts = Array.isArray(sortable) ? sortable : [sortable];

    for (const sort of _sorts) {
      collection.add(sort);
    }

    return new Query(this.specs, collection.items, this.pageable);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { specs: this.specs, sorts: this.sorts, pageable: this.pageable };
  }
}
