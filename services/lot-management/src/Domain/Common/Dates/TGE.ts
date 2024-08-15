import { NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class TGE extends ValueObject {
  static TBD = new TGE(NullableObject, true);

  static fromDate(date: Date) {
    return new TGE(date, false);
  }

  private constructor(
    readonly date: Date | NullableObject,
    readonly isTBD: boolean,
  ) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.date, this.isTBD];
  }
}
