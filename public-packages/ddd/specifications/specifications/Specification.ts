import LINQ from '@berish/linq';

import { Entity, ValueObject } from '../../domain';
import { combineSpecificationFilters, combineSpecificationsToSpecificationFilter } from './helpers';

export type SpecificationInferEntity<T> = T extends Specification<infer TEntity> ? TEntity : never;

export abstract class Specification<TEntity extends Entity> extends ValueObject {
  static isSatisfied<TEntity extends Entity>(specifications: Specification<TEntity> | Specification<TEntity>[], items: TEntity | TEntity[]) {
    const specs = Array.isArray(specifications) ? specifications : [specifications];
    return specs.every((spec) => spec.isSatisfied(items));
  }

  private readonly _innerSpecs: Specification<TEntity>[] = [];
  private readonly _predicates: ((item: TEntity) => boolean)[] = [];
  private _isLockedLocalSpecify: boolean = false;

  constructor() {
    super();
  }

  get childSpecifications() {
    return this._innerSpecs;
  }

  get predicates() {
    return this._predicates;
  }

  get isLockedLocalSpecify() {
    return this._isLockedLocalSpecify;
  }

  isSatisfied(items: TEntity | TEntity[]): boolean {
    if (this._isLockedLocalSpecify) throw new TypeError('Specification is local specify locked. You can use only resolver for this.');

    const predicateRoot = combineSpecificationFilters(this._predicates);
    const specificationPredicateRoot = combineSpecificationsToSpecificationFilter(this._innerSpecs);

    if (Array.isArray(items)) return items.every((item) => predicateRoot(item) && specificationPredicateRoot(item));
    return predicateRoot(items) && specificationPredicateRoot(items);
  }

  protected addSpecification(...specs: (Specification<TEntity> | Specification<TEntity>[])[]) {
    const _specs = LINQ.from(specs)
      .selectMany((m) => (Array.isArray(m) ? m : [m]))
      .filter(Boolean)
      .toArray();

    this._innerSpecs.push(..._specs);

    if (_specs.some((m) => m.isLockedLocalSpecify)) {
      this.lockLocalSpecify();
    }
  }

  protected addFilter(filter: (item: TEntity) => boolean): void {
    // const _predicates = LINQ.from(predicates)
    //   .selectMany((m) => (Array.isArray(m) ? m : [m]))
    //   .filter(Boolean)
    //   .toArray();

    // this._predicates.push(..._predicates);
    this._predicates.push(filter);
  }

  /**
   * Блокирует локальную спецификацию. isSatified будет выдавать ошибку при попытке фильтрации.
   * Блокировка нужна в тех случаях, когда локальная спецификация невозможна, например, найти книги, у которых ссылка на автора соответсвует ее специцикации
   */
  protected lockLocalSpecify(): void {
    this._isLockedLocalSpecify = true;
  }
}
