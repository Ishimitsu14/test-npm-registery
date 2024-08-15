import { NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class LockupPeriod extends ValueObject {
  static IS_OVER = new LockupPeriod(NullableObject);

  static fromString(period: string) {
    return new LockupPeriod(period);
  }

  private readonly _period: string | NullableObject;
  private readonly _isAlreadyOver: boolean;

  private constructor(period: string | NullableObject) {
    super();

    this._period = period;
  }

  get period() {
    return this._period;
  }

  get isOver(): boolean {
    return NullableObject.isEmpty(this._period);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._period, this._isAlreadyOver];
  }
}
