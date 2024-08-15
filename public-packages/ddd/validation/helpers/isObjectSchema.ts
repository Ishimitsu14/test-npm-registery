import { ObjectSchema } from '../types';
import { isSchema } from './isSchema';

export function isObjectSchema<T>(value: any): value is ObjectSchema<T> {
  if (typeof value === 'object' && Boolean(value) && !Array.isArray(value)) {
    return Object.keys(value).every((key) => isSchema(value?.[key]));
  }
  return false;
}
