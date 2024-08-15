import LINQ from '@berish/linq';

import { concatTypes } from '../helpers';
import { resolveSchema } from '../helpers/resolveSchema';
import { Schema, Validator } from '../types';

export function andSchema<T>(schema: Schema<T>): Validator<T> {
  const validators = Array.isArray(schema) ? schema.map((subSchema) => resolveSchema<T>(subSchema)) : [resolveSchema(schema)];
  if (validators.length === 1) return validators[0];

  const type = concatTypes(...validators.map((m) => m.type));
  const disableNullCheck = validators.some((m) => m.disableNullCheck);
  const composites = validators.filter((m) => typeof m.composite === 'function').map((m) => m.composite);

  return {
    type,
    validate: validators,
    disableNullCheck,

    composite:
      composites.length > 0
        ? (value, key, isValidated) => {
            return LINQ.from(composites)
              .selectMany((composite) => composite(value, key, isValidated))
              .toArray();
          }
        : void 0,
  };
}
