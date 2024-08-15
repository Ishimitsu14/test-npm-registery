import { Primitive, ValueObjectAtomicValue } from '@ddd/domain';

export class URI extends Primitive {
  static raw(value: string) {
    return new URI(value);
  }

  private readonly _value: string;

  private constructor(value: string) {
    super();

    this._value = value;
  }

  get value() {
    return this._value;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._value];
  }
}
