import { getRegisteredAggregationResolvers, getRegisteredSortableResolvers, getRegisteredSpecificationResolvers, QueryResolver } from '@ddd/specifications';
import { ModuleMetadata } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export function commonDatabaseInject(manager: QueryResolver<any>): ModuleMetadata['providers'] {
  return [
    {
      provide: QueryResolver,
      useFactory: (discoveryService: DiscoveryService) => {
        const injectedProviders = discoveryService
          .getProviders()
          .map((wrapper) => wrapper.instance)
          .filter(Boolean);

        const registeredSpecificationResolvers = getRegisteredSpecificationResolvers(injectedProviders);
        for (const registeredSpecificationResolver of registeredSpecificationResolvers) {
          manager.registerSpecificationResolver(registeredSpecificationResolver.specificationType, registeredSpecificationResolver.specificationResolver);
        }

        const registeredSortableResolvers = getRegisteredSortableResolvers(injectedProviders);
        for (const resolver of registeredSortableResolvers) {
          manager.registerSortableResolver(resolver.sortableType, resolver.sortableResolver);
        }

        const registeredAggregationResolvers = getRegisteredAggregationResolvers(injectedProviders);
        for (const resolver of registeredAggregationResolvers) {
          manager.registerAggregationResolver(resolver.specificationType, resolver.specificationResolver);
        }

        return manager;
      },
      inject: [DiscoveryService],
    },
  ];
}
