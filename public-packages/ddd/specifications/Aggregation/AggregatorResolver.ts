import { QueryResolver } from '../QueryResolver';
import { Aggregation, AggregationInferOutput } from './Aggregation';

export abstract class AggregationResolver<TAggregation extends Aggregation<any>> {
  private _queryResolver: QueryResolver<any>;

  abstract resolve(aggregator: TAggregation): Promise<AggregationInferOutput<TAggregation>>;

  get queryResolver(): QueryResolver<any> {
    return this._queryResolver;
  }

  setupQueryResolver(queryResolver: QueryResolver<any>) {
    this._queryResolver = queryResolver;
  }
}
