import { Equatable } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import Decimal from 'decimal.js';

import { Precision } from './Precision';

/** Процент. От 0 до 1 (0% до 100%) */
export class Percent extends ValueObject {
  static INTEGER = Precision.create(2);
  static TWO_DECIMALS = Precision.create(4);
  static FOUR_DECIMALS = Precision.create(6);

  static fromTwoValues(total: Decimal.Value, current: Decimal.Value, precision: Precision) {
    total = new Decimal(total);
    current = new Decimal(current);

    const percentDecimal = current.div(total);

    return new Percent(percentDecimal, precision);
  }

  static fromFloat(value: Decimal.Value, precision: Precision) {
    return new Percent(value, precision);
  }

  static fromHumanValue(value: Decimal.Value, precision: Precision) {
    value = new Decimal(value).div(100);

    return Percent.fromFloat(value, precision);
  }

  readonly value: Decimal;
  readonly precision: Precision;

  private constructor(value: Decimal.Value, precision: Precision) {
    super();

    this.precision = precision;
    this.value = this.precision.round(value);
  }

  minus(value: Percent): Percent {
    return Percent.fromFloat(this.value.minus(value.value), this.precision);
  }

  plus(value: Percent): Percent {
    return Percent.fromFloat(this.value.plus(value.value), this.precision);
  }

  toHumanValue() {
    return this.value.mul(100);
  }

  toString() {
    return this.value.toString();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [Equatable.wrap(this.value, (item1, item2) => Decimal.isDecimal(item2) && item1.equals(item2)), this.precision];
  }
}
