import { ConstructorType } from '@ddd/core';

import { Sortable } from './Sortable';
import { SortableResolver } from './SortableResolver';

export const REGISTER_SORTABLE_RESOLVER_METADATA = Symbol('REGISTER_SORTABLE_RESOLVER_METADATA');

export function RegisterSortableResolver(specificationType: ConstructorType<Sortable<any>, typeof Sortable>): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(REGISTER_SORTABLE_RESOLVER_METADATA, specificationType, target);
  };
}

export function getRegisteredSortableResolvers(providers: any[]) {
  return providers
    .filter((provider) => provider instanceof SortableResolver)
    .map((sortableResolver: SortableResolver<any>) => {
      const sortableType: ConstructorType<Sortable<any>, typeof Sortable> = Reflect.getMetadata(REGISTER_SORTABLE_RESOLVER_METADATA, sortableResolver.constructor);
      if (!sortableType) return void 0;

      return {
        sortableType,
        sortableResolver,
      };
    })
    .filter(Boolean);
}
