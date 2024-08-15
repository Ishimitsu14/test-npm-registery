import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { isStringWithValueSchema, Validator } from '@shared/validation';

export class Telegram extends ValueObject {
  static fromString(value: string) {
    return new Telegram(value);
  }

  static fromSnapshot(value: string) {
    return new Telegram(value);
  }

  static get validator(): Validator<Telegram> {
    return {
      type: 'EvmPublicAddress',
      validate: [isStringWithValueSchema, (value: string) => new RegExp(/^0x[a-fA-F0-9]{40}$/g).test(value)],
    };
  }

  private constructor(readonly value: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.value];
  }
}
