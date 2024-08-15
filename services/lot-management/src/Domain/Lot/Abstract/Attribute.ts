import { Nullable, NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { AttributeValue } from './AttributeValue';

export class Attribute<Value extends ValueObjectAtomicValue> extends ValueObject {
  static create<Value extends ValueObjectAtomicValue>(name: string, defaultValue?: Nullable<Value>) {
    return new Attribute<Value>(name, NullableObject(defaultValue), NullableObject);
  }

  readonly name: string;
  readonly defaultValue: Nullable<Value>;
  readonly customRule: Nullable<(value: Value) => boolean>;

  private constructor(name: string, defaultValue: Nullable<Value>, customRule: Nullable<(value: Value) => boolean>) {
    super();

    this.name = name;
    this.defaultValue = defaultValue;
    this.customRule = customRule;
  }

  createValue(value: Value) {
    return new AttributeValue(this, value);
  }

  withCustomRule(rule: (value: Value) => boolean) {
    return new Attribute(this.name, this.defaultValue, rule);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.name, this.defaultValue];
  }
}
