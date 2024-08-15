import { NullableObject } from '@ddd/core';
import { concatTypes, Schema, validate } from '@ddd/validation';
import { IncorrectParameterError } from '@schema/common';

export function validateRoot<T>(item: T, schema: Schema<T>): void {
  const invalidResult = validate(schema, item, []);
  if (NullableObject.hasValue(invalidResult)) throw new IncorrectParameterError(invalidResult.key.join('.'), concatTypes(invalidResult.type));
}
