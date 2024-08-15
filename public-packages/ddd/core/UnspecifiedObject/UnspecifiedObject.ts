import { Equatable } from '../Equatable';

const UNSPECIFIED_TYPE = Symbol('UNSPECIFIED_TYPE');

export interface UnspecifiedObject extends Equatable<UnspecifiedObject | null | undefined> {
  [UNSPECIFIED_TYPE]: typeof UNSPECIFIED_TYPE;

  /** If value `isEmpty`, then UnspecifiedObject or defaultValue. Otherwise used value.*/
  (): UnspecifiedObject;
  <T>(value: T | UnspecifiedObject | null | undefined): T | UnspecifiedObject;
  <T>(value: T | UnspecifiedObject | null | undefined, defaultValueFactory: () => T): T;

  /** `value` === `UnspecifiedObject` */
  isExtends(value: any): value is UnspecifiedObject;
  /** `value` === `UnspecifiedObject` | `null` | `undefined` */
  isUnspecified(value: any): value is UnspecifiedObject | null | undefined;
  /** Value not empty */
  hasValue<T>(value: T | UnspecifiedObject | null | undefined): value is T;

  toString(): string;
  toUndefined(): undefined;
}

export const UnspecifiedObject = <UnspecifiedObject>(<T>(value?: T | UnspecifiedObject | null | undefined, defaultValueFactory?: () => T): T | UnspecifiedObject => {
  if (UnspecifiedObject.isUnspecified(value)) return UnspecifiedObject.isUnspecified(defaultValueFactory) ? UnspecifiedObject : defaultValueFactory();
  return value;
});
UnspecifiedObject.isExtends = (value: any): value is UnspecifiedObject => {
  return value === UnspecifiedObject || (typeof value === 'object' && !!value && value[UNSPECIFIED_TYPE] === UNSPECIFIED_TYPE);
};
UnspecifiedObject.isUnspecified = (value: any): value is UnspecifiedObject => {
  return typeof value === 'undefined' || value === null || UnspecifiedObject.isExtends(value);
};
UnspecifiedObject.hasValue = <T>(value: T | UnspecifiedObject | null | undefined): value is T => {
  return !UnspecifiedObject.isUnspecified(value);
};
UnspecifiedObject.isEquals = (other: UnspecifiedObject | null | undefined): boolean => {
  return UnspecifiedObject.isUnspecified(other);
};
UnspecifiedObject.toString = (): string => {
  return UnspecifiedObject.name;
};
UnspecifiedObject.toUndefined = (): undefined => {
  return undefined;
};
UnspecifiedObject[UNSPECIFIED_TYPE] = UNSPECIFIED_TYPE;

Object.freeze(UnspecifiedObject);
