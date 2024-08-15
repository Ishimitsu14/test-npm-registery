import LINQ from '@berish/linq';

import { validateSchema } from '../common';
import { stringifyTypes } from '../helpers';
import { resolveSchema } from '../helpers/resolveSchema';
import { Schema, Validator } from '../types';

export function isArraySchema<T>(schema: Schema<T>, length?: Schema<number>): Validator<T[]> {
  const lengthValidator = length && resolveSchema(length);

  return {
    type: [lengthValidator ? `Array(length => ${stringifyTypes(lengthValidator.type)})` : 'Array'],
    validate: [(m) => Array.isArray(m), lengthValidator && ((m: T[]) => validateSchema(lengthValidator, m.length, []).every((m) => m.isValidated))].filter(Boolean),
    composite: schema
      ? (value, key) => {
          const innerResults = value.map((item, index) => {
            return validateSchema(schema, item, key.concat(String(index)));
          });

          // const subKeys = Object.keys(schema);
          // const innerResults = subKeys.map((subKey) => {
          //   const subSchema: Schema<any> = schema?.[subKey];
          //   const subValue = value?.[subKey];

          //   return validate(subSchema, subValue, key.concat(subKey));
          // });

          return LINQ.from(innerResults)
            .selectMany((m) => m)
            .toArray();
        }
      : void 0,
  };
}
