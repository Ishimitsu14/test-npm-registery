import { ISnapshotEntity } from '@ddd/infra';
import { Sortable, SortableInferEntity, Specification, SpecificationInferEntity } from '@ddd/specifications';
import { FilterQuery, OrderDefinition } from '@mikro-orm/core';
import { QueryBuilder } from '@mikro-orm/postgresql';

import { IMikroOrmRepository } from './Interfaces';

export type MikroOrmPredicate<TSnapshot extends ISnapshotEntity<any>> = (qb: QueryBuilder<TSnapshot>) => QueryBuilder<TSnapshot>;

export type MikroOrmSortable<TSortable extends Sortable<any>, TSnapshot extends ISnapshotEntity<SortableInferEntity<TSortable>>> = (
  sortable: TSortable,
  repository: IMikroOrmRepository<SortableInferEntity<TSortable>, TSnapshot>,
) => OrderDefinition<TSnapshot> | Promise<OrderDefinition<TSnapshot>>;

export type MikroOrmSpecification<TSpec extends Specification<any>, TSnapshot extends ISnapshotEntity<SpecificationInferEntity<TSpec>>> = (
  spec: TSpec,
  repository: IMikroOrmRepository<SpecificationInferEntity<TSpec>, TSnapshot>,
) => FilterQuery<TSnapshot> | Promise<FilterQuery<TSnapshot>>;

export type MikroOrmSpecificationPredicate<TSpec extends Specification<any>, TSnapshot extends ISnapshotEntity<SpecificationInferEntity<TSpec>>> = (
  spec: TSpec,
  repository: IMikroOrmRepository<SpecificationInferEntity<TSpec>, TSnapshot>,
) => MikroOrmPredicate<TSnapshot> | Promise<MikroOrmPredicate<TSnapshot>>;
