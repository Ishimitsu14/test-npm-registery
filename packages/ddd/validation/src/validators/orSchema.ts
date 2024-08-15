import { validateSchema } from '../common';
import { stringifyTypes } from '../helpers';
import { resolveSchema } from '../helpers/resolveSchema';
import { Schema, Validator } from '../types';

export function orSchema(schema: Schema<any>): Validator<any> {
  const validators = Array.isArray(schema) ? schema.map((subSchema) => resolveSchema(subSchema)) : [resolveSchema(schema)];
  if (validators.length === 1) return validators[0];

  const operatorsType = validators.map((m) => stringifyTypes(m.type));

  return {
    type: `(${operatorsType.join(' || ')})`,
    validate: [
      (m, k) => {
        return validators.some((validator) => validateSchema(validator, m, k).every((m) => m.isValidated));
      },
    ],
    disableNullCheck: validators.some((m) => m.disableNullCheck),
  };
}
