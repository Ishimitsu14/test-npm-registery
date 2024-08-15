import { inspect } from 'util';

import { NullableObject } from '../NullableObject';

export interface Equatable<T> {
  isEquals(value: any): boolean;
  [inspect.custom]?: () => string;
}

export const Equatable = {
  isEquatable: <T>(value: any): value is Equatable<T> => {
    return (value ?? null) !== null && typeof value === 'object' && typeof value['isEquals'] === 'function';
  },
  isEquals: <T>(first: T, second: T) => {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;

    if (first === second) return true;
    if (Equatable.isEquatable(first)) return Equatable.isEquatable(second) && first.isEquals(second);

    return Object.is(first, second);
  },
  wrap: <T>(item: T, isEquals: (item: T, other: T) => boolean = (item, other) => Object.is(item, other)): Equatable<T> => {
    return {
      isEquals: (other: T) => {
        if (Equatable.isEquals(item, other)) return true;

        return isEquals(item, other);
      },
      [inspect.custom]: () => {
        return inspect(item);
      },
    };
  },
};
