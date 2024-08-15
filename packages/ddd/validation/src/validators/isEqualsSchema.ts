import { Validator } from '../types';

export function isEqualsSchema<T>(value: T): Validator<T> {
  return {
    type: `Equals(${value})`,
    validate: [(m) => Object.is(m, value)],
  };
}
