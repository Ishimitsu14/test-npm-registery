import { Nullable, NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import Decimal from 'decimal.js';

export class Precision extends ValueObject {
  static DYNAMIC = new Precision(NullableObject);

  static create(value: number) {
    return new Precision(value);
  }

  static maxPrecisionFromItems(items: Precision[]) {
    if (items.length <= 0) return Precision.DYNAMIC;

    if (items.some((m) => m.isEquals(Precision.DYNAMIC))) return Precision.DYNAMIC;

    const precisionValues = items.map((m) => m.value).filter((m) => NullableObject.hasValue(m)) as number[];
    if (precisionValues.length <= 0) return Precision.DYNAMIC;

    return Precision.create(Decimal.max(...precisionValues).toNumber());
  }

  private constructor(readonly value: Nullable<number>) {
    super();

    this.value = NullableObject.map(value, (value) => Math.floor(value));
  }

  round(value: Decimal.Value) {
    const precision = this.value;
    const currentValue = new Decimal(value);

    if (NullableObject.isEmpty(precision)) return currentValue;
    if (precision >= 0) return currentValue.toDecimalPlaces(precision);

    const pow = new Decimal(10).pow(Decimal.abs(precision));
    return currentValue.div(pow).toDecimalPlaces(0).mul(pow);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.value];
  }
}
