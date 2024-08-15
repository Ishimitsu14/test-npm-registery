import { Equatable } from '../Equatable';
import { NullableObject } from '../NullableObject';
import { ConstructorType } from '../This';

export interface DynamicAttributeWithValue<Type> extends DynamicAttribute<Type> {
  getValue(): Type;
}

type DynamicAttributeValuePrimitive<Type> = Type | NullableObject | DynamicAttribute<Type> | DynamicAttributeWithValue<Type>;
type DynamicAttributeValue<Type> = DynamicAttributeValuePrimitive<Type> | (() => DynamicAttributeValuePrimitive<Type>);

export type DynamicAttributeInferType<T> = T extends DynamicAttribute<infer Type> ? Type : never;

export class DynamicAttribute<Type> implements Equatable<DynamicAttribute<Type>> {
  static create<Type>(): DynamicAttribute<Type>;
  static create<Type>(value: NullableObject | null | undefined | (() => NullableObject | null | undefined)): DynamicAttribute<Type>;
  static create<Type>(value: DynamicAttribute<Type> | (() => DynamicAttribute<Type>)): DynamicAttribute<Type>;
  static create<Type>(value: Type | DynamicAttributeWithValue<Type> | (() => Type | DynamicAttributeWithValue<Type>)): DynamicAttributeWithValue<Type>;
  static create<Type>(value?: DynamicAttributeValue<Type>): DynamicAttribute<Type> | DynamicAttributeWithValue<Type> {
    return new DynamicAttribute(value);
  }

  static isExtends<T extends DynamicAttribute<any>>(this: ConstructorType<T>, instance: any): instance is T {
    const self = this as any as typeof DynamicAttribute;

    return !!instance && instance instanceof self;
  }

  static isEquals(first: DynamicAttribute<any>, second: DynamicAttribute<any>) {
    if (NullableObject.isEmpty(first) && NullableObject.isEmpty(second)) return true;
    if (NullableObject.isEmpty(first) || NullableObject.isEmpty(second)) return false;
    if (!DynamicAttribute.isExtends(first) || !DynamicAttribute.isExtends(second)) return false;

    if (Equatable.isEquatable(first._value)) return Equatable.isEquatable(second._value) && first._value.isEquals(second._value);
    return first._value === second._value;
  }

  static hasValue<Type>(instance: DynamicAttribute<Type>): instance is DynamicAttributeWithValue<Type> {
    if (!DynamicAttribute.isExtends(instance)) return false;

    const valueResolved = DynamicAttribute.resolveValue(instance);
    if (NullableObject.hasValue(valueResolved)) return true;
    return false;
  }

  static setValue<Type>(attribute: DynamicAttribute<Type>, value: DynamicAttributeValue<Type>): void {
    if (!DynamicAttribute.isExtends(attribute)) throw new TypeError(`${DynamicAttribute.name} setValue: ${attribute} is not DynamicAttribute. Use ${DynamicAttribute.name}.isExtends for check type.`);

    attribute._value = value;
  }

  private static resolveValue<Type>(attribute: DynamicAttribute<Type>): Type | NullableObject {
    if (NullableObject.isEmpty(attribute)) return NullableObject;
    if (!DynamicAttribute.isExtends(attribute)) return NullableObject;

    const attributeValue = attribute._value;
    if (NullableObject.isEmpty(attributeValue)) return attributeValue;
    if (DynamicAttribute.isExtends(attributeValue)) return DynamicAttribute.resolveValue(attributeValue);

    if (typeof attributeValue === 'function') {
      const nextValue = (attributeValue as () => Type | DynamicAttribute<Type> | NullableObject)();
      if (NullableObject.isEmpty(nextValue)) return NullableObject;
      if (DynamicAttribute.isExtends(nextValue)) return DynamicAttribute.resolveValue(nextValue);
      return nextValue;
    }
    return attributeValue;
  }

  private _value: DynamicAttributeValue<Type>;

  private constructor(value: DynamicAttributeValue<Type>) {
    this._value = value;
    this['getValue'] = (): Type => {
      const valueResolved = DynamicAttribute.resolveValue(this);
      if (NullableObject.isEmpty(valueResolved)) throw new TypeError(`${DynamicAttribute.name} getValue: value is empty. Use ${DynamicAttribute.name}.hasValue for check value.`);
      return valueResolved;
    };
  }

  next<NewType>(callback: (value: Type) => DynamicAttributeValuePrimitive<NewType>): DynamicAttribute<NewType> {
    return DynamicAttribute.create<NewType>(() => (this.hasValue() ? <NewType>callback(this.getValue()) : <NewType>NullableObject));
  }

  /** Есть ли значение у аттрибута значение */
  hasValue(): this is DynamicAttributeWithValue<Type> {
    return DynamicAttribute.hasValue(this);
  }

  isEquals(other: DynamicAttribute<Type>): boolean {
    return DynamicAttribute.isEquals(this, other);
  }
}
