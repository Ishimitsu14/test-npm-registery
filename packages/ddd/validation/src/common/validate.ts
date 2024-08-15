import LINQ from '@berish/linq';
import { Nullable, NullableObject } from '@ddd/core';

import { stringifyTypes } from '../helpers';
import { Schema, SchemaKey, ValidationResult } from '../types';
import { andSchema } from '../validators';
import { validateSchema } from './validateSchema';

export function validate<T>(schema: Schema<T>, value: T, key: SchemaKey[] = []): Nullable<ValidationResult> {
  const results = validateSchema(schema, value, key);
  const resultGroupByKey = LINQ.from(results)
    .groupBy((m) => m.key.join('.'))
    .toArray();

  const keyResults = resultGroupByKey.map<ValidationResult>(([key, results]) => {
    return {
      key: results[0].key,
      type: stringifyTypes(...results.map((m) => m.type)),
      validator: andSchema(results.map((m) => m.validator)),
      isValidated: results.every((m) => m.isValidated),
    } as ValidationResult;
  });

  const firstInvalidatedResult = keyResults.find((m) => !m.isValidated);
  return NullableObject(firstInvalidatedResult);
}
