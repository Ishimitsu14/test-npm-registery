import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { Attribute } from './Attribute';

export class AttributeValue<Value extends ValueObjectAtomicValue> extends ValueObject {
  readonly attribute: Attribute<Value>;
  readonly value: Value;

  constructor(attribute: Attribute<Value>, value: Value) {
    super();

    this.attribute = attribute;
    this.value = value;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.attribute, this.value];
  }
}
