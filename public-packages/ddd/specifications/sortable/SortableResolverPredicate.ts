import { IQueryReadRepository } from '../QueryRepository';
import { Sortable, SortableInferEntity } from './Sortable';

export type SortableResolverPredicate<TSortable extends Sortable<any>, TRepository extends IQueryReadRepository<SortableInferEntity<TSortable>>, TResult> = (
  sortable: TSortable,
  repository: TRepository,
) => TResult | Promise<TResult>;

export type SortableResolverPredicateInferResult<T> = T extends SortableResolverPredicate<any, any, infer TResult> ? TResult : never;
