import Decimal from 'decimal.js';

import { Validator } from '../types';
import { isStringWithValueSchema } from './isStringSchema';

export const isNumberSchema: Validator<number> = {
  type: 'Number',
  validate: [(value): value is number => typeof value === 'number'],
};

export const isNumberAsStringSchema: Validator<string> = {
  type: 'NumberAsString',
  validate: [
    isStringWithValueSchema,
    (value: string) => {
      try {
        new Decimal(value);
      } catch (err) {
        return false;
      }

      return true;
    },
  ],
};
