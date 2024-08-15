import { ValidatorType } from '../types';
import { concatTypes } from './concatTypes';

/**
 * Объединение типов в одну единую строку
 * @param types
 * @returns
 */
export function stringifyTypes(...types: ValidatorType[]): string {
  types = concatTypes(...types);
  if (types.length === 0) return 'ANY';
  if (types.length === 1) return types.join(', ');

  return `(${types.join(', ')})`;
}
