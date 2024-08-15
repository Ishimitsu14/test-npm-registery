import { Validator, ValidatorFunction, ValidatorType } from '../types';

export function rawSchema<T>(type: ValidatorType, validate: ValidatorFunction<T>): Validator<T> {
  return {
    type,
    validate: [validate],
  };
}
