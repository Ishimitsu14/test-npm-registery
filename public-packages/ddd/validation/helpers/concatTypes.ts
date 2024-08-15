import LINQ from '@berish/linq';

import { ValidatorType } from '../types';

/**
 * Объединение нескольких типов в конкретный тип (массив строк)
 * @param types
 * @returns
 */
export function concatTypes(...types: ValidatorType[]): string[] {
  return LINQ.from(types)
    .selectMany((type) => (Array.isArray(type) ? type : [type]))
    .distinct()
    .toArray();
}
