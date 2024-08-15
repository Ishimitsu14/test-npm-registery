import { Equatable } from '../Equatable';

const VOIDABLE_TYPE = Symbol('VOIDABLE_TYPE');

export type Voidable<T> = T | VoidableObject;

export interface VoidableObject extends Equatable<VoidableObject | undefined> {
  [VOIDABLE_TYPE]: typeof VOIDABLE_TYPE;

  /** If value `isEmpty`, then VoidableObject or defaultValue. Otherwise used value.*/
  (): VoidableObject;
  <T>(value: T | VoidableObject | undefined): Voidable<T>;
  <T>(value: T | VoidableObject | undefined, defaultValue: T): T;

  /** `value` === `undefined` */
  isUndefined(value: any): value is undefined;
  /** `value` === `VoidableObject` */
  isExtends(value: any): value is VoidableObject;
  /** `value` === `VoidableObject` | `undefined` */
  isEmpty(value: any): value is VoidableObject | undefined;
  /** Value not empty */
  hasValue<T>(value: T | VoidableObject | undefined): value is T;

  toString(): string;
  toUndefined(): undefined;
}

export const VoidableObject = <VoidableObject>(<T>(value?: T | VoidableObject | undefined, defaultValue?: T): Voidable<T> => {
  if (VoidableObject.isEmpty(value)) return VoidableObject.isEmpty(defaultValue) ? VoidableObject : defaultValue;
  return value;
});
VoidableObject.isUndefined = (value: any): value is undefined => {
  return typeof value === 'undefined';
};

VoidableObject.isExtends = (value: any): value is VoidableObject => {
  return value === VoidableObject || (typeof value === 'object' && !!value && value[VOIDABLE_TYPE] === VOIDABLE_TYPE);
};
VoidableObject.isEmpty = (value: any): value is VoidableObject => {
  return VoidableObject.isUndefined(value) || VoidableObject.isExtends(value);
};
VoidableObject.hasValue = <T>(value: T | VoidableObject | null | undefined): value is T => {
  return !VoidableObject.isEmpty(value);
};
VoidableObject.isEquals = (other: VoidableObject | null | undefined): boolean => {
  return VoidableObject.isEmpty(other);
};
VoidableObject.toString = (): string => {
  return VoidableObject.name;
};

VoidableObject.toUndefined = (): undefined => {
  return undefined;
};

VoidableObject[VOIDABLE_TYPE] = VOIDABLE_TYPE;

Object.freeze(VoidableObject);
