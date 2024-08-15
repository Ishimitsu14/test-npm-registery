import { getClassOfInstance } from '@berish/class';

import { ConstructorType, Nullable, NullableObject } from '../../core';
import { Entity } from '../../domain';
import { Aggregation, AggregationInferOutput, AggregationResolver, IAggregationQueryResolver } from '../Aggregation';
import { Pageable } from '../pageable';
import { Query } from '../query/Query';
import { IQueryReadRepository, IQueryRepository } from '../QueryRepository';
import { Sortable, SortableInferEntity, SortableResolver, SortableResolverPredicate } from '../sortable';
import { AndSpecification, EmptySpecification, Specification, SpecificationInferEntity, SpecificationResolver, SpecificationResolverPredicate } from '../specifications';
import { AggregationIsNotCorrect, AggregationResolverIsNotDefined, SortableIsNotCorrect, SortableResolverIsNotDefined, SpecificationIsNotCorrect, SpecificationResolverIsNotDefined } from './errors';

export abstract class QueryResolver<TQueryPredicate> implements IAggregationQueryResolver {
  private readonly _specificationResolvers: Map<ConstructorType<Specification<any>>, SpecificationResolver<any>> = new Map();
  private readonly _sortableResolvers: Map<ConstructorType<Sortable<any>>, SortableResolver<any>> = new Map();
  private readonly _aggregationResolvers: Map<ConstructorType<Aggregation<any>>, AggregationResolver<any>> = new Map();

  abstract combinePredicates(queryPredicates: TQueryPredicate[]): TQueryPredicate;
  abstract resolveSpecification<TSpecification extends Specification<any>>(
    specification: TSpecification | TSpecification[],
    repository: IQueryRepository<SpecificationInferEntity<TSpecification>>,
  ): Promise<TQueryPredicate>;
  abstract resolveSortable<TSortable extends Sortable<any>>(sortable: TSortable | TSortable[], repository: IQueryRepository<SortableInferEntity<TSortable>>): Promise<TQueryPredicate>;
  abstract resolvePageable<TEntity extends Entity>(pageable: Pageable, repository: IQueryRepository<TEntity>): Promise<TQueryPredicate>;

  registerSpecificationResolver<TSpecification extends Specification<any>>(
    specificationType: ConstructorType<TSpecification>,
    specificationResolver: SpecificationResolver<SpecificationResolverPredicate<TSpecification, IQueryReadRepository<SpecificationInferEntity<TSpecification>>, any>>,
  ) {
    this._specificationResolvers.set(specificationType, specificationResolver);
    specificationResolver.setupQueryResolver(this);
  }

  registerSortableResolver<TSortable extends Sortable<any>>(
    sortableType: ConstructorType<TSortable>,
    sortableResolver: SortableResolver<SortableResolverPredicate<TSortable, IQueryReadRepository<SortableInferEntity<TSortable>>, any>>,
  ) {
    this._sortableResolvers.set(sortableType, sortableResolver);
    sortableResolver.setupQueryResolver(this);
  }

  registerAggregationResolver<TAggregation extends Aggregation<any>>(aggregatorType: ConstructorType<TAggregation, typeof Aggregation>, aggregationResolver: AggregationResolver<TAggregation>) {
    this._aggregationResolvers.set(aggregatorType, aggregationResolver);
    aggregationResolver.setupQueryResolver(this);
  }

  async resolveQuery<TEntity extends Entity>(query: Query<TEntity>, repository: IQueryRepository<TEntity>): Promise<TQueryPredicate> {
    const specificationPredicate = await this.resolveSpecification<Specification<TEntity>>(query.rootSpecification, repository);
    const sortablePredicate = await this.resolveSortable<Sortable<TEntity>>(query.sorts, repository);
    const pageablePredicate = await this.resolvePageable<TEntity>(query.pageable, repository);

    return this.combinePredicates([specificationPredicate, sortablePredicate, pageablePredicate]);
  }

  resolveAggregation<TAggregation extends Aggregation<any>>(aggregator: TAggregation): Promise<AggregationInferOutput<TAggregation>> {
    const aggregationType = this.getAggregationType(aggregator);
    const nativeResolver = this.findNativeAggregationResolver(aggregationType);

    if (NullableObject.isEmpty(nativeResolver)) throw new TypeError(AggregationResolverIsNotDefined(aggregationType.name));

    return nativeResolver.resolve(aggregator);
  }

  resolveAggregationMany<T extends [] | readonly Aggregation<any>[]>(values: T): Promise<{ -readonly [P in keyof T]: AggregationInferOutput<T[P]> }> {
    return Promise.all(values.map((value) => this.resolveAggregation(value))) as Promise<{ -readonly [P in keyof T]: AggregationInferOutput<T[P]> }>;
  }

  protected resolveSpecificationResults<TSpecification extends Specification<any>, TResult>(
    specification: TSpecification,
    repository: IQueryRepository<SpecificationInferEntity<TSpecification>>,
  ): Promise<TResult[]> {
    const specificationType = this.getSpecificationType(specification);
    const nativeResolver = this.findNativeSpecificationResolver(specificationType);

    // Есть прямой обработчик
    if (NullableObject.hasValue(nativeResolver)) {
      const directPredicates = nativeResolver.predicates.slice();
      const directResults: Promise<TResult[]> = Promise.all(directPredicates.map((predicate) => predicate(specification, repository)));

      if (specification.childSpecifications.length > 0) {
        const childResults: Promise<TResult[]> = this.resolveSpecificationResults(
          specification.childSpecifications.length === 1 ? specification.childSpecifications[0] : AndSpecification.create(specification.childSpecifications),
          repository,
        );
        return Promise.all([directResults, childResults]).then(([raw, child]) => [...raw, ...child]);
      }

      return directResults;
    }

    // Прямой обработчик не найден, но у него есть свои предикаты. Тогда ошибка, что не определили специальный резолвер
    if (specification.predicates.length > 0) throw new TypeError(SpecificationResolverIsNotDefined(specificationType.name));

    // Прямой обработчик не найден, но спецификация комбинированная (имеет внутренние спецификации)
    // Состоит из 0 элементов, возврат пустой спецификации
    if (specification.childSpecifications.length === 0) return this.resolveSpecificationResults(EmptySpecification.create(), repository);

    // Состоит из 1 элемента, возвраем единственную как главную
    if (specification.childSpecifications.length === 1) return this.resolveSpecificationResults(specification.childSpecifications[0], repository);

    // Состоит больше чем из 1 элемента, объединяем в одну
    if (specification.childSpecifications.length > 1) return this.resolveSpecificationResults(AndSpecification.create(specification.childSpecifications), repository);

    // Если что-то пошло не так, во всех остальных случаях ошибка, что резолвер не определен
    throw new TypeError(SpecificationResolverIsNotDefined(specificationType.name));
  }

  protected resolveSortableResults<TSortable extends Sortable<any>, TResult>(sortable: TSortable, repository: IQueryRepository<SortableInferEntity<TSortable>>): Promise<TResult[]> {
    const sortableType = this.getSortableType(sortable);
    const nativeResolver = this.findNativeSortableResolver(sortableType);

    if (NullableObject.isEmpty(nativeResolver)) throw new TypeError(SortableResolverIsNotDefined(sortableType.name));

    // Есть прямой обработчик
    const directPredicates = nativeResolver.predicates.slice();
    const directResults: Promise<TResult[]> = Promise.all(directPredicates.map((predicate) => predicate(sortable, repository)));
    return directResults;
  }

  protected findNativeSpecificationResolver<TSpecification extends Specification<any>>(
    specificationType: ConstructorType<TSpecification>,
  ): Nullable<SpecificationResolver<SpecificationResolverPredicate<TSpecification, IQueryReadRepository<SpecificationInferEntity<TSpecification>>, any>>> {
    return NullableObject(this._specificationResolvers.get(specificationType));
  }

  protected findNativeSortableResolver<TSortable extends Sortable<any>>(
    sortableType: ConstructorType<TSortable>,
  ): Nullable<SortableResolver<SortableResolverPredicate<TSortable, IQueryReadRepository<SortableInferEntity<TSortable>>, any>>> {
    return NullableObject(this._sortableResolvers.get(sortableType));
  }

  protected findNativeAggregationResolver<TAggregation extends Aggregation<any>>(aggregatorType: ConstructorType<TAggregation>): Nullable<AggregationResolver<TAggregation>> {
    return NullableObject(this._aggregationResolvers.get(aggregatorType));
  }

  /**
   * Получает тип спецификации (класс)
   * @param specification
   * @returns
   */
  protected getSpecificationType<TSpecification extends Specification<any>>(specification: TSpecification): ConstructorType<TSpecification> {
    const specificationType = getClassOfInstance(specification);
    if (!specificationType || !Specification.isExtends(specification)) throw new TypeError(SpecificationIsNotCorrect(specification));

    return specificationType;
  }

  /**
   * Получает тип спецификации (класс)
   * @param specification
   * @returns
   */
  protected getSortableType<TSortable extends Sortable<any>>(sortable: TSortable): ConstructorType<TSortable> {
    const type = getClassOfInstance(sortable);
    if (!type || !Sortable.isExtends(sortable)) throw new TypeError(SortableIsNotCorrect(sortable));

    return type;
  }

  /**
   * Получает тип агрегатора
   * @param aggregator
   * @returns
   */
  protected getAggregationType<TAggregator extends Aggregation<any>>(aggregator: TAggregator): ConstructorType<TAggregator> {
    const type = getClassOfInstance(aggregator);
    if (!type || !Aggregation.isExtends(aggregator)) throw new TypeError(AggregationIsNotCorrect(aggregator));

    return type;
  }
}
