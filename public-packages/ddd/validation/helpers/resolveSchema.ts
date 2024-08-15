import { Schema, Validator } from '../types';
import { andSchema, objectSchema } from '../validators';
import { isObjectSchema } from './isObjectSchema';
import { isRefSchema } from './isRefSchema';
import { isValidator } from './isValidator';

export function resolveSchema<T>(schema: Schema<T>): Validator<T> {
  if (Array.isArray(schema)) return andSchema(schema);
  if (isRefSchema(schema)) return resolveSchema(schema.ref());
  if (isValidator(schema)) return schema;
  if (isObjectSchema(schema)) return objectSchema('Object', schema);

  throw new TypeError('Not supported schema');
}
