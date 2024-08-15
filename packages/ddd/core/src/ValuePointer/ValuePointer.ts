import { Equatable } from '../Equatable';
import { NullableObject } from '../NullableObject';
import { ConstructorType } from '../This';

export class ValuePointer<Type> implements Equatable<ValuePointer<Type>> {
  static create<Type>(pointer: () => Type): ValuePointer<Type> {
    return new ValuePointer(pointer);
  }

  static createStatic<Type>(value: Type): ValuePointer<Type> {
    return new ValuePointer(() => value);
  }

  static isExtends<T extends ValuePointer<any>>(this: ConstructorType<T, typeof ValuePointer>, instance: any): instance is T {
    return !!instance && instance instanceof <any>this;
  }

  static isEquals<T extends ValuePointer<any>>(this: ConstructorType<T, typeof ValuePointer>, first: T, second: T) {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;

    if (!this.isExtends(first) || !this.isExtends(second)) return false;
    if (!this.isEqualsTypes(first, second)) return false;

    // Одна и та же ссылка
    if (first === second) return true;

    const firstResolved = first.resolve();
    const secondResolved = second.resolve();
    if (Equatable.isEquatable(firstResolved)) return Equatable.isEquatable(secondResolved) && firstResolved.isEquals(secondResolved);

    return firstResolved === secondResolved;
  }

  static isEqualsTypes<T extends ValuePointer<any>>(this: ConstructorType<T, typeof ValuePointer>, first: T, second: T): boolean {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;
    if (!this.isExtends(first) || !this.isExtends(second)) return false;

    const firstStaticClass = <typeof ValuePointer>first.constructor;
    const secondStaticClass = <typeof ValuePointer>second.constructor;

    return firstStaticClass === secondStaticClass;
  }

  private readonly _pointer: () => Type;

  private constructor(pointer: () => Type) {
    this._pointer = pointer;
  }

  resolve(): Type {
    return this._pointer();
  }

  isEquals(other: this): boolean {
    const staticClass = <typeof ValuePointer>this.constructor;
    return staticClass.isEquals(this, other);
  }
}
