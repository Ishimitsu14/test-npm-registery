import { ConstructorType, Equatable, NullableObject } from '@ddd/core';
import { inspect } from 'util';

import { IValueObject } from './IValueObject';

export type ValueObjectAtomicValue =
  | null
  | undefined
  | NullableObject
  | string
  | number
  | bigint
  | symbol
  | boolean
  | Date
  | Equatable<any>
  | ValueObjectAtomicValue[]
  | { [key: string]: ValueObjectAtomicValue };

export abstract class ValueObject implements IValueObject {
  static isExtends<T extends ValueObject>(this: ConstructorType<T, typeof ValueObject>, instance: any): instance is T {
    return !!instance && instance instanceof this;
  }

  static isEquals<T extends ValueObject>(this: ConstructorType<T, typeof ValueObject>, first: T, second: T): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;

    if (!this.isExtends(first) || !this.isExtends(second)) return false;
    if (!this.isEqualsTypes(first, second)) return false;

    // Одна и та же ссылка
    if (first === second) return true;
    return this.isEqualsAtomicValue(first.getAtomicValues(), second.getAtomicValues());
  }

  static isEqualsTypes<T extends ValueObject>(this: ConstructorType<T, typeof ValueObject>, first: T, second: T): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;
    if (!this.isExtends(first) || !this.isExtends(second)) return false;

    const firstStaticClass = <typeof ValueObject>first.constructor;
    const secondStaticClass = <typeof ValueObject>second.constructor;

    return firstStaticClass === secondStaticClass;
  }

  static isEqualsAtomicValue(firstAtomicValue: ValueObjectAtomicValue, secondAtomicValue: ValueObjectAtomicValue): boolean {
    if (NullableObject.isEmpty(firstAtomicValue) && NullableObject.isEmpty(secondAtomicValue)) return true;
    if (NullableObject.isEmpty(firstAtomicValue) || NullableObject.isEmpty(secondAtomicValue)) return false;

    /** Одна и та же ссылка на объект */
    if (firstAtomicValue === secondAtomicValue) return true;

    if (typeof firstAtomicValue === 'string') return typeof secondAtomicValue === 'string' && firstAtomicValue === secondAtomicValue;
    if (typeof firstAtomicValue === 'number') return typeof secondAtomicValue === 'number' && firstAtomicValue === secondAtomicValue;
    if (typeof firstAtomicValue === 'boolean') return typeof secondAtomicValue === 'boolean' && firstAtomicValue === secondAtomicValue;
    if (typeof firstAtomicValue === 'bigint') return typeof secondAtomicValue === 'bigint' && firstAtomicValue === secondAtomicValue;
    if (typeof firstAtomicValue === 'symbol') return typeof secondAtomicValue === 'symbol' && firstAtomicValue === secondAtomicValue;
    if (firstAtomicValue instanceof Date) return secondAtomicValue instanceof Date && +firstAtomicValue === +secondAtomicValue;
    if (Array.isArray(firstAtomicValue)) return Array.isArray(secondAtomicValue) && firstAtomicValue.every((item, index) => this.isEqualsAtomicValue(item, secondAtomicValue[index]));

    if (Equatable.isEquatable(firstAtomicValue)) return Equatable.isEquatable(secondAtomicValue) && firstAtomicValue.isEquals(secondAtomicValue);
    if (typeof firstAtomicValue === 'object')
      return typeof secondAtomicValue === 'object' && Object.keys(firstAtomicValue).every((key) => this.isEqualsAtomicValue(firstAtomicValue[key], secondAtomicValue[key]));

    return Object.is(firstAtomicValue, secondAtomicValue);
  }

  static getType<T extends ValueObject>(this: ConstructorType<T, typeof ValueObject>): typeof this {
    return this as ConstructorType<T, typeof ValueObject>;
  }

  static getTypeOfInstance<T extends ValueObject>(instance: T): ConstructorType<T, typeof ValueObject> {
    return <ConstructorType<T, typeof ValueObject>>instance?.constructor;
  }

  protected abstract getAtomicValues(): ValueObjectAtomicValue;

  isEquals(other: any): other is this {
    const staticClass = <typeof ValueObject>this.constructor;
    return staticClass.isEquals(this, other);
  }

  [inspect.custom]() {
    return `${this.constructor.name} -> ${inspect(this.getAtomicValues(), { showHidden: false, colors: true, compact: true, depth: 0 })}`;
  }
}
