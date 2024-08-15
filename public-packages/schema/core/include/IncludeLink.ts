import { Include } from './Include';

export type IncludeLink<TInclude> =
  TInclude extends Include<any, infer Schema>
    ? { [Key in keyof Schema]: Schema[Key] extends Include<infer Owner, infer InnerSchema> ? IncludeLink<InnerSchema> | Owner | IncludeLink<Schema[Key]> : Schema[Key] }[keyof Schema]
    : never;
