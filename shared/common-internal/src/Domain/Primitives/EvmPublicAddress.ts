import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { isStringWithValueSchema, Validator } from '@shared/validation';

export class EvmPublicAddress extends ValueObject {
  static raw(value: string) {
    return new EvmPublicAddress(value);
  }

  static fromSnapshot(value: string) {
    return new EvmPublicAddress(value);
  }

  static get validator(): Validator<string> {
    return {
      type: 'EvmPublicAddress',
      validate: [isStringWithValueSchema, (value: string) => new RegExp(/^0x[a-fA-F0-9]{40}$/g).test(value)],
    };
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
