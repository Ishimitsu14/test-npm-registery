import { inspect } from 'util';

import { Equatable } from '../Equatable';

const NULLABLE_TYPE = Symbol('NULLABLE_TYPE');

export type Nullable<T> = T | NullableObject;

export type NullableMap<T> = {
  [Key in keyof T]: T[Key] | NullableObject;
};

export interface NullableObject extends Equatable<NullableObject | null | undefined> {
  [NULLABLE_TYPE]: typeof NULLABLE_TYPE;

  /** If value `isEmpty`, then NullableObject or defaultValue. Otherwise used value.*/
  (): NullableObject;
  <T>(value: T | NullableObject | null | undefined): Nullable<T>;
  <T>(value: T | NullableObject | null | undefined, defaultValue: T): T;

  /** `value` === `undefined` */
  isUndefined(value: any): value is undefined;
  /** `value` === `null` || `undefined` */
  isNull(value: any): value is null | undefined;
  /** `value` === `NullableObject` */
  isExtends(value: any): value is NullableObject;
  /** `value` === `NullableObject` | `null` | `undefined` */
  isEmpty(value: any): value is NullableObject | null | undefined;
  /** Value not empty */
  hasValue<T>(value: T | NullableObject | null | undefined): value is T;
  /** Is empty then Nullable, otherwise Value */
  map<T>(value: T | NullableObject | null | undefined): Nullable<T>;
  map<T>(value: T): T;
  map<T, K>(value: T | NullableObject | null | undefined, then: (value: T) => K): Nullable<K>;
  map<T, K>(value: T, callback: (value: T) => K): K;

  mapNull<T>(value: T | NullableObject | null | undefined): T | null;
  mapNull<T>(value: T): T;
  mapNull<T, K>(value: T | NullableObject | null | undefined, then: (value: T) => K): K | null;
  mapNull<T, K>(value: T, callback: (value: T) => K): K;

  mapUndefined<T>(value: T | NullableObject | null | undefined): T | undefined;
  mapUndefined<T>(value: T): T;
  mapUndefined<T, K>(value: T | NullableObject | null | undefined, then: (value: T) => K): K | undefined;
  mapUndefined<T, K>(value: T, callback: (value: T) => K): K;

  toString(): string;
  toNull(): null;
  toUndefined(): null;
}

export const NullableObject = <NullableObject>(<T>(value?: T | NullableObject | null | undefined, defaultValue?: T): T | NullableObject => {
  if (NullableObject.isEmpty(value)) return NullableObject.isEmpty(defaultValue) ? NullableObject : defaultValue;
  return value;
});
NullableObject.isUndefined = (value: any): value is undefined => {
  return typeof value === 'undefined';
};
NullableObject.isNull = (value: any): value is null => {
  return NullableObject.isUndefined(value) || value === null;
};
NullableObject.isExtends = (value: any): value is NullableObject => {
  return value === NullableObject || (typeof value === 'object' && !!value && value[NULLABLE_TYPE] === NULLABLE_TYPE);
};
NullableObject.isEmpty = (value: any): value is NullableObject => {
  return NullableObject.isUndefined(value) || NullableObject.isNull(value) || NullableObject.isExtends(value);
};
NullableObject.hasValue = <T>(value: T | NullableObject | null | undefined): value is T => {
  return !NullableObject.isEmpty(value);
};
NullableObject.isEquals = (other: NullableObject | null | undefined): boolean => {
  return NullableObject.isEmpty(other);
};
NullableObject.toString = (): string => {
  return NullableObject.name;
};
NullableObject.toNull = (): null => {
  return null;
};
NullableObject[inspect.custom] = () => 'NullableObject';
NullableObject.toUndefined = (): undefined => {
  return undefined;
};
NullableObject.map = <T, K>(value: T | NullableObject | null | undefined, then?: (value: T) => K): T | K | NullableObject => {
  if (NullableObject.isEmpty(value)) return NullableObject;
  return then ? then(value) : value;
};

NullableObject.mapNull = <T, K>(value: T | NullableObject | null | undefined, then?: (value: T) => K): T | K | null => {
  if (NullableObject.isEmpty(value)) return NullableObject.toNull();
  return then ? then(value) : value;
};

NullableObject.mapUndefined = <T, K>(value: T | NullableObject | null | undefined, then?: (value: T) => K): T | K | undefined => {
  if (NullableObject.isEmpty(value)) return NullableObject.toUndefined();
  return then ? then(value) : value;
};

NullableObject[NULLABLE_TYPE] = NULLABLE_TYPE;

Object.freeze(NullableObject);
