import { Schema } from '../types';
import { isObjectSchema } from './isObjectSchema';
import { isRefSchema } from './isRefSchema';
import { isValidator } from './isValidator';

export function isSchema<T>(value: any): value is Schema<T> {
  return isRefSchema(value) || isValidator(value) || isObjectSchema(value) || isSchemaArray(value);
}

export function isSchemaArray<T>(value: any): value is Schema<T>[] {
  return Array.isArray(value) && !value.some((m) => !isSchema(m));
  // return isRefSchema(value) || isValidator(value) || isObjectSchema(value)
  // return isCommonSchema(value) || isCommonSchemaArray(value);
}

// export function isCommonSchema<T>(value: any): value is CommonSchema<T> {
//   return isRefSchema(value) || isValidator(value) || isObjectSchema(value);
// }

// export function isCommonSchemaArray<T>(value: any): value is CommonSchema<T>[] {
//   return Array.isArray(value) && !value.some((m) => !isCommonSchema(m));
// }
