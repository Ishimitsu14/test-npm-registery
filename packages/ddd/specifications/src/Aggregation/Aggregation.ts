import { ValueObject } from '@ddd/domain';

const OUTPUT_TYPE: unique symbol = null;

export abstract class Aggregation<Result> extends ValueObject {
  readonly [OUTPUT_TYPE]: Result;

  constructor() {
    super();
  }
}

export type AggregationInferOutput<T extends Aggregation<any>> = T[typeof OUTPUT_TYPE];
