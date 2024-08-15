import { Equatable } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import Decimal from 'decimal.js';

import { Precision } from './Precision';
import { StablecoinQuantity } from './StablecoinQuantity';
import { UnitQuantity } from './UnitQuantity';

/**
 * Цена актива к Stable монете
 */
export class Price extends ValueObject {
  static fromQuantities(stablecoinQuantity: StablecoinQuantity, unitQuantity: UnitQuantity, pricePrecision: Precision) {
    const price = stablecoinQuantity.value.div(unitQuantity.value);
    return Price.fromNumber(price, pricePrecision);
  }

  static fromNumber(value: Decimal.Value, pricePrecision: Precision) {
    return new Price(value, pricePrecision);
  }

  readonly value: Decimal;
  readonly precision: Precision;

  private constructor(value: Decimal.Value, precision: Precision) {
    super();

    this.precision = precision;
    this.value = this.precision.round(value);
  }

  mul(value: Decimal.Value) {
    return new Price(this.value.mul(value), this.precision);
  }

  toString() {
    return this.value.toString();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return {
      value: Equatable.wrap(this.value, (item1, item2) => Decimal.isDecimal(item2) && item1.equals(item2)),
      precision: this.precision,
    };
  }
}
