import { Entity } from '@ddd/domain';
import { Sortable, SortableInferEntity, Specification, SpecificationInferEntity } from '@ddd/specifications';

import { IMockRepository } from './Interfaces';

export type MockQueryPredicate<TEntity extends Entity<any>> = (entities: TEntity[]) => TEntity[] | Promise<TEntity[]>;

export type MockSpecificationPredicate<TSpecification extends Specification<any>> = (
  specification: TSpecification,
  repository: IMockRepository<SpecificationInferEntity<TSpecification>>,
) => MockQueryPredicate<SpecificationInferEntity<TSpecification>> | Promise<MockQueryPredicate<SpecificationInferEntity<TSpecification>>>;

export type MockSortablePredicate<TSortable extends Sortable<any>> = (
  sortable: TSortable,
  repository: IMockRepository<SortableInferEntity<TSortable>>,
) => MockQueryPredicate<SortableInferEntity<TSortable>> | Promise<MockQueryPredicate<SortableInferEntity<TSortable>>>;
