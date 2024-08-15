import { Validator } from '../types';

export const isBooleanSchema: Validator<boolean> = {
  type: 'Boolean',
  validate: [(value): value is boolean => typeof value === 'boolean'],
};
