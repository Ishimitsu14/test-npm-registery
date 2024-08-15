import { PubsubMessage } from '../interfaces';
import { Path, PathValue } from './Helpers';

export type PubsubMessageSchemaMap<Metadata extends Record<string, any>> = {
  [key: string]: PubsubMessageSchemaMap<Metadata> | PubsubMessage<any, Metadata>;
};

export type PubsubMessageSchemaPath<TSchemaMap extends PubsubMessageSchemaMap<any>> = Path<TSchemaMap>;
export type PubsubMessageSchemaPathValue<TSchemaMap extends PubsubMessageSchemaMap<any>, TSchemaPath extends PubsubMessageSchemaPath<TSchemaMap>> =
  PathValue<TSchemaMap, TSchemaPath> extends PubsubMessage<any, any> ? PathValue<TSchemaMap, TSchemaPath> : never;

export type PubsubMessageSchemaContent<TSchemaMap extends PubsubMessageSchemaMap<any>, TSchemaPath extends PubsubMessageSchemaPath<TSchemaMap>> =
  PubsubMessageSchemaPathValue<TSchemaMap, TSchemaPath> extends PubsubMessage<infer Content, any> ? Content : never;
