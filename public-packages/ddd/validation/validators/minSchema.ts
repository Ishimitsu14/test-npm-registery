import { Validator } from '../types';

export function minSchema(minValue: number = 0): Validator<string | number> {
  return {
    type: `Min(${minValue})`,
    validate: [
      (value: string | number) => {
        if (typeof value === 'string') return value.length >= minValue;
        if (typeof value === 'number') return value >= minValue;
        return true;
      },
    ],
  };
}
