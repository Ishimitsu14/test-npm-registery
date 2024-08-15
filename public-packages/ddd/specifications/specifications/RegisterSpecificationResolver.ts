import { ConstructorType } from '../../core';
import { Specification } from './Specification';
import { SpecificationResolver } from './SpecificationResolver';

export const REGISTER_SPECIFICATION_RESOLVER_METADATA = Symbol('REGISTER_SPECIFICATION_RESOLVER_METADATA');

export function RegisterSpecificationResolver(specificationType: ConstructorType<Specification<any>, typeof Specification>): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(REGISTER_SPECIFICATION_RESOLVER_METADATA, specificationType, target);
  };
}

export function getRegisteredSpecificationResolvers(providers: any[]) {
  return providers
    .filter((provider) => provider instanceof SpecificationResolver)
    .map((specificationResolver: SpecificationResolver<any>) => {
      const specificationType: ConstructorType<Specification<any>, typeof Specification> = Reflect.getMetadata(REGISTER_SPECIFICATION_RESOLVER_METADATA, specificationResolver.constructor);
      if (!specificationType) return void 0;

      return {
        specificationType,
        specificationResolver,
      };
    })
    .filter(Boolean);
}
