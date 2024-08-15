import { Resource } from './Resource';
import { ResourceKey } from './ResourceKey';

export type ResourceOmitName<T extends Resource<any> | ResourceKey<any>> = Omit<T, 'resource'>;
