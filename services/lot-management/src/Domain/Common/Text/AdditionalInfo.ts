import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { isStringWithValueSchema, maxSchema, Validator } from '@shared/validation';

export class AdditionalInfo extends ValueObject {
  static fromString(value: string) {
    return new AdditionalInfo(value);
  }

  static fromSnapshot(value: string) {
    return new AdditionalInfo(value);
  }

  static get validator(): Validator<AdditionalInfo> {
    return {
      type: 'AdditionalInfo',
      validate: [isStringWithValueSchema, maxSchema(1000)],
    };
  }

  private constructor(readonly value: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.value];
  }
}
