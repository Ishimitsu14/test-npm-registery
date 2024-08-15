import { ResourceKey } from './ResourceKey';
import { ResourceOmitName } from './ResourceOmitName';

export type Resource<Name extends string, PrimaryKey extends ResourceKey<string> = { resource: '_key' }> = {
  resource: Name;
} & ResourceOmitName<PrimaryKey>;

export type ResourceInferName<T> = T extends Resource<infer Name, any> ? Name : never;
