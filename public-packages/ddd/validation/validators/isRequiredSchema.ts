import { Validator } from '../types';

export const isRequiredSchema: Validator<any> = {
  type: 'Required',
  validate: [(value): value is any => typeof value !== 'undefined' && value !== null],

  disableNullCheck: true,
};
