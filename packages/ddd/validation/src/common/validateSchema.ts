import { resolveSchema } from '../helpers';
import { Schema, SchemaKey, ValidationResult } from '../types';
import { validateValidator } from './validateValidator';

export function validateSchema<T>(schema: Schema<T>, value: T, key: SchemaKey[] = []): ValidationResult[] {
  const resolvedValidator = resolveSchema(schema);
  return validateValidator(resolvedValidator, value, key);
}
