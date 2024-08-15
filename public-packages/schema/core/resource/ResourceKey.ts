export interface ResourceKey<ResourceName extends string> {
  resource: `${ResourceName}_key`;
}

export type ResourceKeyInferName<T> = T extends ResourceKey<infer Name> ? Name : never;
