import { ConstructorType } from '../../core';
import { Aggregation, AggregationInferOutput } from './Aggregation';
import { AggregationResolver } from './AggregatorResolver';

export interface IAggregationQueryResolver {
  registerAggregationResolver<TAggregation extends Aggregation<any>>(aggregatorType: ConstructorType<TAggregation, typeof Aggregation>, aggregationResolver: AggregationResolver<TAggregation>): void;
  resolveAggregation<TAggregation extends Aggregation<any>>(aggregator: TAggregation): Promise<AggregationInferOutput<TAggregation>>;
  resolveAggregationMany<T extends readonly Aggregation<any>[] | []>(values: T): Promise<{ -readonly [P in keyof T]: AggregationInferOutput<T[P]> }>;
}
