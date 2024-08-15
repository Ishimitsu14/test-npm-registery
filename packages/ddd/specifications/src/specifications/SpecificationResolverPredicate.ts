import { IQueryReadRepository } from '../QueryRepository';
import { Specification, SpecificationInferEntity } from './Specification';

export type SpecificationResolverPredicate<TSpec extends Specification<any>, TRepository extends IQueryReadRepository<SpecificationInferEntity<TSpec>>, TResult> = (
  spec: TSpec,
  repository: TRepository,
) => TResult | Promise<TResult>;

export type SpecificationResolverPredicateInferFilter<T> = T extends SpecificationResolverPredicate<any, any, infer TResult> ? TResult : never;
