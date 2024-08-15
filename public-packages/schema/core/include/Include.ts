import { Resource } from '../resource';

export type Include<Owner extends Resource<any>, TSchema> = {
  [Key in keyof TSchema]?: Include<any, any> extends TSchema[Key] ? boolean | TSchema[Key] : TSchema[Key] extends Resource<any> ? boolean : never;
};

export type IncludeInferSchema<T> = T extends Include<any, infer Schema> ? Schema : never;
export type IncludeInferOwner<T> = T extends Include<infer Owner, any> ? Owner : never;
