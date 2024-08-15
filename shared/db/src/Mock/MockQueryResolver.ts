import LINQ from '@berish/linq';
import { Entity, EntityKey } from '@ddd/domain';
import {
  AndSpecification,
  EmptySpecification,
  NotSpecification,
  OrSpecification,
  Pageable,
  Query,
  QueryResolver,
  Sortable,
  SortableInferEntity,
  Specification,
  SpecificationInferEntity,
  WhereInPKSpecification,
} from '@ddd/specifications';

import { IMockRepository } from './Interfaces';
import { AndSpecificationResolver, EmptySpecificationResolver, NotSpecificationResolver, OrSpecificationResolver, WhereInPKSpecificationResolver } from './Specifications/SystemResolvers';
import { MockQueryPredicate, MockSortablePredicate, MockSpecificationPredicate } from './types';

export class MockQueryResolver extends QueryResolver<MockQueryPredicate<any>> {
  constructor() {
    super();

    this.registerSpecificationResolver(EmptySpecification, new EmptySpecificationResolver());
    this.registerSpecificationResolver(AndSpecification, new AndSpecificationResolver());
    this.registerSpecificationResolver(OrSpecification, new OrSpecificationResolver());
    this.registerSpecificationResolver(NotSpecification, new NotSpecificationResolver());
    this.registerSpecificationResolver(WhereInPKSpecification, new WhereInPKSpecificationResolver());
  }

  override resolveQuery<TEntity extends Entity<EntityKey>>(query: Query<TEntity>, repository: IMockRepository<TEntity>): Promise<MockQueryPredicate<TEntity>> {
    return super.resolveQuery(query, repository);
  }

  async resolveSpecification<TSpecification extends Specification<any>>(
    specification: TSpecification | TSpecification[],
    repository: IMockRepository<SpecificationInferEntity<TSpecification>>,
  ): Promise<MockQueryPredicate<SpecificationInferEntity<TSpecification>>> {
    const rootSpec = AndSpecification.create<SpecificationInferEntity<TSpecification>>(specification);

    const result = await this.resolveSpecificationPredicateResult(rootSpec, repository);
    return result;
  }

  async resolveSortable<TSortable extends Sortable<any>>(
    sortable: TSortable | TSortable[],
    repository: IMockRepository<SortableInferEntity<TSortable>>,
  ): Promise<MockQueryPredicate<SortableInferEntity<TSortable>>> {
    sortable = Array.isArray(sortable) ? sortable : [sortable];

    const results = await Promise.all(sortable.map((sortable) => this.resolveSortablePredicateResult(sortable, repository)));
    return this.combinePredicates(results);
  }

  async resolvePageable<TEntity extends Entity>(pageable: Pageable, repository: IMockRepository<TEntity>): Promise<MockQueryPredicate<TEntity>> {
    return (entities) => LINQ.from(entities).skip(pageable.skip).take(pageable.limit).toArray();
  }

  async resolveSpecificationPredicateResult<TSpecification extends Specification<any>>(
    specification: TSpecification,
    repository: IMockRepository<SpecificationInferEntity<TSpecification>>,
  ): Promise<ReturnType<MockSpecificationPredicate<TSpecification>>> {
    const results = await this.resolveSpecificationResults<TSpecification, ReturnType<MockSpecificationPredicate<TSpecification>>>(specification, repository);
    const awaitedResults = await Promise.all(results.map((result) => Promise.resolve(result)));

    return this.combinePredicates(awaitedResults);
  }

  async resolveSortablePredicateResult<TSortable extends Sortable<any>>(
    sortable: TSortable,
    repository: IMockRepository<SortableInferEntity<TSortable>>,
  ): Promise<ReturnType<MockSortablePredicate<TSortable>>> {
    const results = await this.resolveSortableResults<TSortable, ReturnType<MockSortablePredicate<TSortable>>>(sortable, repository);
    const awaitedResults = await Promise.all(results.map((result) => Promise.resolve(result)));

    return this.combinePredicates(awaitedResults);
  }

  combinePredicates<TEntity extends Entity>(queryPredicates: MockQueryPredicate<TEntity>[]): MockQueryPredicate<TEntity> {
    return (entities) => {
      return queryPredicates.reduce((entities, filter) => entities.then((m) => filter(m)), Promise.resolve(entities));
    };
  }
}
