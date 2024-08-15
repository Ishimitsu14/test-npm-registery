import { Equatable } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import Decimal from 'decimal.js';

import { Percent } from './Percent';
import { Precision } from './Precision';
import { Price } from './Price';
import { StablecoinQuantity } from './StablecoinQuantity';

/**
 * Количество актива в Stable монете
 */
export class UnitQuantity extends ValueObject {
  static fromStablecoinQuantity(stablecoinQuantity: StablecoinQuantity, price: Price, unitQuantityPrecision: Precision) {
    const unitQuantity = stablecoinQuantity.value.div(price.value);
    return UnitQuantity.fromNumber(unitQuantity, unitQuantityPrecision);
  }

  static fromNumber(value: Decimal.Value, unitQuantityPrecision: Precision) {
    return new UnitQuantity(value, unitQuantityPrecision);
  }

  static sum(items: UnitQuantity[]) {
    if (items.length <= 0) return UnitQuantity.fromNumber(0, Precision.DYNAMIC);

    return UnitQuantity.fromNumber(Decimal.sum(...items.map((m) => m.value)), Precision.maxPrecisionFromItems(items.map((m) => m.precision)));
  }

  readonly value: Decimal;
  readonly precision: Precision;

  private constructor(value: Decimal.Value, precision: Precision) {
    super();

    this.precision = precision;
    this.value = this.precision.round(value);
  }

  mul(value: Percent): UnitQuantity;
  mul(value: Decimal.Value): UnitQuantity;
  mul(value: Decimal.Value | Percent) {
    if (Percent.isExtends(value)) return this.mul(value.value);

    return UnitQuantity.fromNumber(this.value.mul(value), this.precision);
  }

  div(value: Percent): UnitQuantity;
  div(value: Decimal.Value): UnitQuantity;
  div(value: Decimal.Value | Percent) {
    if (Percent.isExtends(value)) return this.div(value.value);

    return UnitQuantity.fromNumber(this.value.div(value), this.precision);
  }

  minus(value: Percent): UnitQuantity;
  minus(value: UnitQuantity): UnitQuantity;
  minus(value: Decimal.Value): UnitQuantity;
  minus(value: Decimal.Value | Percent | UnitQuantity) {
    if (Percent.isExtends(value)) return this.mul(Percent.fromFloat(1, value.precision).minus(value));
    if (UnitQuantity.isExtends(value)) return this.minus(value.value);

    return UnitQuantity.fromNumber(this.value.minus(value), this.precision);
  }

  plus(value: Percent): UnitQuantity;
  plus(value: UnitQuantity): UnitQuantity;
  plus(value: Decimal.Value): UnitQuantity;
  plus(value: Decimal.Value | Percent | UnitQuantity) {
    if (Percent.isExtends(value)) return this.mul(Percent.fromFloat(1, value.precision).plus(value));
    if (UnitQuantity.isExtends(value)) return this.plus(value.value);

    return UnitQuantity.fromNumber(this.value.plus(value), this.precision);
  }

  toString() {
    return this.value.toString();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [Equatable.wrap(this.value, (item1, item2) => Decimal.isDecimal(item2) && item1.equals(item2)), this.precision];
  }
}
