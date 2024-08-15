import { ConstructorType } from '@ddd/core';

import { Aggregation } from './Aggregation';
import { AggregationResolver } from './AggregatorResolver';

export const REGISTER_AGGREGATION_RESOLVER_METADATA = Symbol('REGISTER_AGGREGATION_RESOLVER_METADATA');

export function RegisterAggregationResolver(type: ConstructorType<Aggregation<any>, typeof Aggregation>): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(REGISTER_AGGREGATION_RESOLVER_METADATA, type, target);
  };
}

export function getRegisteredAggregationResolvers(providers: any[]) {
  return providers
    .filter((provider) => provider instanceof AggregationResolver)
    .map((specificationResolver) => {
      const specificationType: ConstructorType<Aggregation<any>, typeof Aggregation> = Reflect.getMetadata(REGISTER_AGGREGATION_RESOLVER_METADATA, specificationResolver.constructor);
      if (!specificationType) return void 0;

      return {
        specificationType,
        specificationResolver,
      };
    })
    .filter(Boolean);
}
