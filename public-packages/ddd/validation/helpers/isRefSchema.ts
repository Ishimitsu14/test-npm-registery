import { RefSchema } from '../types';

export function isRefSchema<T>(value: any): value is RefSchema<T> {
  if (typeof value === 'object' && Boolean(value) && 'ref' in value && typeof value.ref === 'function') return true;
  return false;
}
