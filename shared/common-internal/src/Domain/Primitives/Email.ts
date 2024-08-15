import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { isStringWithValueSchema, Validator } from '@shared/validation';

export class Email extends ValueObject {
  static raw(value: string) {
    return new Email(value);
  }

  static fromSnapshot(value: string) {
    return new Email(value);
  }

  static get validator(): Validator<Email> {
    return {
      type: 'Email',
      validate: [isStringWithValueSchema, (value: string) => new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g).test(value)],
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
