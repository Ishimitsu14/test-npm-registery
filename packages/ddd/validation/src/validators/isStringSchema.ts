import { Validator } from '../types';

export const isStringSchema: Validator<string> = {
  type: 'String',
  validate: [(value): value is string => typeof value === 'string'],
};

export const isStringWithValueSchema: Validator<string> = {
  type: 'StringWithValue',
  validate: [isStringSchema, (value: string) => !!value.trim()],
};
