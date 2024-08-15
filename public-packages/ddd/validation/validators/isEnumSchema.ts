import { stringifyTypes } from '../helpers';
import { Validator } from '../types';
import { isStringWithValueSchema } from './isStringSchema';

export function isEnumSchema<T extends string[] | readonly string[]>(enumeration: T): Validator<T[number] | string> {
  const type = `Enum(${stringifyTypes(enumeration.slice())})`;

  return {
    type,
    validate: [isStringWithValueSchema, (value: string) => enumeration.indexOf(value) !== -1],
  };
}
