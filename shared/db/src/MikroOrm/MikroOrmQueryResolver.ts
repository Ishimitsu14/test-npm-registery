import LINQ from '@berish/linq';
import { ConstructorType } from '@ddd/core';
import { Entity } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import {
  AndSpecification,
  EmptySpecification,
  IQueryReadRepository,
  IQueryRepository,
  NotSpecification,
  OrSpecification,
  Pageable,
  Query,
  QueryResolver,
  Sortable,
  SortableInferEntity,
  Specification,
  SpecificationInferEntity,
  SpecificationResolver,
  SpecificationResolverPredicate,
  WhereInPKSpecification,
} from '@ddd/specifications';
import { OrderDefinition, QueryBuilder, QueryOrderMap } from '@mikro-orm/postgresql';

import { IMikroOrmRepository } from './Interfaces';
import { AndSpecificationResolver, EmptySpecificationResolver, NotSpecificationResolver, OrSpecificationResolver, WhereInPKSpecificationResolver } from './Specifications/SystemResolvers';
import { MikroOrmPredicate } from './types';

export type MikroOrmQueryPredicate<TSnapshot extends ISnapshotEntity<any>> = (qb: QueryBuilder<TSnapshot>) => QueryBuilder<TSnapshot>;

export class MikroOrmQueryResolver extends QueryResolver<MikroOrmQueryPredicate<any>> {
  constructor() {
    super();

    this.registerSpecificationResolver(EmptySpecification, new EmptySpecificationResolver());
    this.registerSpecificationResolver(AndSpecification, new AndSpecificationResolver());
    this.registerSpecificationResolver(OrSpecification, new OrSpecificationResolver());
    this.registerSpecificationResolver(NotSpecification, new NotSpecificationResolver());
    this.registerSpecificationResolver(WhereInPKSpecification, new WhereInPKSpecificationResolver());
  }

  combinePredicates<TSnapshot extends ISnapshotEntity<any>>(queryPredicates: MikroOrmQueryPredicate<TSnapshot>[]): MikroOrmQueryPredicate<TSnapshot> {
    return (builder) => queryPredicates.reduce((builder, filter) => filter(builder), builder);
  }

  registerSpecificationResolver<TSpecification extends Specification<any>>(
    specificationType: ConstructorType<TSpecification>,
    specificationResolver: SpecificationResolver<SpecificationResolverPredicate<TSpecification, IQueryReadRepository<SpecificationInferEntity<TSpecification>>, any>>,
  ): void {
    return super.registerSpecificationResolver(specificationType, specificationResolver);
  }

  override async resolveQuery<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>>(
    query: Query<TEntity>,
    repository: IMikroOrmRepository<TEntity, TSnapshot>,
  ): Promise<MikroOrmQueryPredicate<TSnapshot>> {
    return super.resolveQuery(query, repository);
  }

  async resolveSpecification<TSpecification extends Specification<any>, TSnapshot extends ISnapshotEntity<SpecificationInferEntity<TSpecification>>>(
    specification: TSpecification | TSpecification[],
    repository: IMikroOrmRepository<SpecificationInferEntity<TSpecification>, TSnapshot>,
  ): Promise<MikroOrmQueryPredicate<TSnapshot>> {
    const rootSpec = AndSpecification.create<SpecificationInferEntity<TSpecification>>(specification);

    return this.resolveSpecificationResult(rootSpec, repository);
  }

  async resolveSortable<TSortable extends Sortable<any>, TSnapshot extends ISnapshotEntity<SortableInferEntity<TSortable>>>(
    sortable: TSortable | TSortable[],
    repository: IMikroOrmRepository<SortableInferEntity<TSortable>, TSnapshot>,
  ): Promise<MikroOrmQueryPredicate<TSnapshot>> {
    sortable = Array.isArray(sortable) ? sortable : [sortable];

    const results = await Promise.all(sortable.map((sortable) => this.resolveSortableResult(sortable, repository)));
    const flatResults = LINQ.from(results)
      .selectMany((m) => m)
      .toArray();
    return (builder) => builder.orderBy(flatResults);
  }

  async resolvePageable<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>>(pageable: Pageable, repository: IQueryRepository<TEntity>): Promise<MikroOrmQueryPredicate<TSnapshot>> {
    return (builder) => builder.offset(pageable.skip).limit(pageable.limit);
  }

  // TODO
  async resolveSpecificationResult<TSpecification extends Specification<any>, TSnapshot extends ISnapshotEntity<SpecificationInferEntity<TSpecification>>>(
    specification: TSpecification,
    repository: IMikroOrmRepository<SpecificationInferEntity<TSpecification>, TSnapshot>,
  ): Promise<MikroOrmPredicate<TSnapshot>> {
    const results = await this.resolveSpecificationResults<TSpecification, MikroOrmPredicate<TSnapshot> | Promise<MikroOrmPredicate<TSnapshot>>>(specification, repository);
    const awaitedResults = await Promise.all(results.map((result) => Promise.resolve(result)));

    return this.combinePredicates(awaitedResults);
  }

  async resolveSortableResult<TSortable extends Sortable<any>, TSnapshot extends ISnapshotEntity<SortableInferEntity<TSortable>>>(
    sortable: TSortable,
    repository: IMikroOrmRepository<SortableInferEntity<TSortable>, TSnapshot>,
  ): Promise<QueryOrderMap<TSnapshot>[]> {
    const results = await this.resolveSortableResults<TSortable, OrderDefinition<TSnapshot> | Promise<OrderDefinition<TSnapshot>>>(sortable, repository);
    return Promise.all(results.map((result) => Promise.resolve(result)));
  }
}
