import LINQ from '@berish/linq';

import { validateSchema } from '../common';
import { ObjectSchema, Schema, Validator, ValidatorType } from '../types';

export function objectSchema<T>(type: ValidatorType = 'Object', schema?: ObjectSchema<T>): Validator<T> {
  return {
    type,
    validate: [(m) => typeof m === 'object' && !Array.isArray(m)],
    composite: schema
      ? (value, key) => {
          const subKeys = Object.keys(schema);
          const innerResults = subKeys.map((subKey) => {
            const subSchema: Schema<any> = schema?.[subKey];
            const subValue = value?.[subKey];

            return validateSchema(subSchema, subValue, key.concat(subKey));
          });

          return LINQ.from(innerResults)
            .selectMany((m) => m)
            .toArray();
        }
      : void 0,
  };
}
