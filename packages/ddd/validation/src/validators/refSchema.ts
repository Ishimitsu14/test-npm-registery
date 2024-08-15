import { RefSchema, Schema } from '../types';

export function refSchema<T>(schema: () => Schema<T>): RefSchema<T> {
  return { ref: schema };
}
