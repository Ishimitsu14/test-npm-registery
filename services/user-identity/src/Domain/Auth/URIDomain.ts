import { Primitive, ValueObjectAtomicValue } from '@ddd/domain';

export class URIDomain extends Primitive {
  static raw(value: string) {
    return new URIDomain(value);
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
