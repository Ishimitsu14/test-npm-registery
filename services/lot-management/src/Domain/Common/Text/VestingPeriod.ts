import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class VestingPeriod extends ValueObject {
  static create(value: string) {
    return new VestingPeriod(value);
  }

  private constructor(readonly value: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.value];
  }
}
