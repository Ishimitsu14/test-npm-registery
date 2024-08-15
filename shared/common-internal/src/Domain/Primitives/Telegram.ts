import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { isStringWithValueSchema, Validator } from '@shared/validation';

export class Telegram extends ValueObject {
  static raw(value: string) {
    return new Telegram(value);
  }

  static fromSnapshot(value: string) {
    return new Telegram(value);
  }

  static get validator(): Validator<Telegram> {
    return {
      type: 'Telegram',
      validate: [isStringWithValueSchema, (value: string) => new RegExp(/^(?=.{5,32}$)(?!.*__)[a-z][a-z0-9_]*[a-z0-9]$/g).test(value)],
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
