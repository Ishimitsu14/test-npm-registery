import { Validator } from '../types';

export function maxSchema(maxValue: number = 0): Validator<string | number> {
  return {
    type: `Max(${maxValue})`,
    validate: [
      (value: string | number) => {
        if (typeof value === 'string') return value.length <= maxValue;
        if (typeof value === 'number') return value <= maxValue;
        return true;
      },
    ],
  };
}
