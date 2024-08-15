import { Equatable } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import Decimal from 'decimal.js';

import { Percent } from './Percent';
import { Precision } from './Precision';
import { Price } from './Price';
import { UnitQuantity } from './UnitQuantity';

/**
 * Количество актива в Stable монете
 */
export class StablecoinQuantity extends ValueObject {
  static PRECISION = Precision.create(2);
  static ZERO = StablecoinQuantity.fromNumber(0);

  static fromUnitQuantity(unitQuantity: UnitQuantity, price: Price) {
    const stableQuantity = unitQuantity.value.mul(price.value);
    return StablecoinQuantity.fromNumber(stableQuantity);
  }

  static fromNumber(value: Decimal.Value) {
    return new StablecoinQuantity(value);
  }

  static sum(items: StablecoinQuantity[]) {
    if (items.length <= 0) return StablecoinQuantity.fromNumber(0);

    return StablecoinQuantity.fromNumber(Decimal.sum(...items.map((m) => m.value)));
  }

  readonly value: Decimal;

  private constructor(value: Decimal.Value) {
    super();

    this.value = StablecoinQuantity.PRECISION.round(value);
  }

  mul(value: Percent): StablecoinQuantity;
  mul(value: Decimal.Value): StablecoinQuantity;
  mul(value: Decimal.Value | Percent) {
    if (Percent.isExtends(value)) return this.mul(value.value);

    return StablecoinQuantity.fromNumber(this.value.mul(value));
  }

  div(value: Percent): StablecoinQuantity;
  div(value: Decimal.Value): StablecoinQuantity;
  div(value: Decimal.Value | Percent) {
    if (Percent.isExtends(value)) return this.div(value.value);

    return StablecoinQuantity.fromNumber(this.value.div(value));
  }

  minus(value: Percent): StablecoinQuantity;
  minus(value: StablecoinQuantity): StablecoinQuantity;
  minus(value: Decimal.Value): StablecoinQuantity;
  minus(value: Decimal.Value | Percent | StablecoinQuantity) {
    if (Percent.isExtends(value)) return this.mul(Percent.fromFloat(1, value.precision).minus(value));
    if (StablecoinQuantity.isExtends(value)) return this.minus(value.value);

    return StablecoinQuantity.fromNumber(this.value.minus(value));
  }

  plus(value: Percent): StablecoinQuantity;
  plus(value: StablecoinQuantity): StablecoinQuantity;
  plus(value: Decimal.Value): StablecoinQuantity;
  plus(value: Decimal.Value | Percent | StablecoinQuantity) {
    if (Percent.isExtends(value)) return this.mul(Percent.fromFloat(1, value.precision).plus(value));
    if (StablecoinQuantity.isExtends(value)) return this.plus(value.value);

    return StablecoinQuantity.fromNumber(this.value.plus(value));
  }

  toString() {
    return this.value.toString();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [Equatable.wrap(this.value, (item1, item2) => Decimal.isDecimal(item2) && item1.equals(item2))];
  }
}

// const fdv = StablecoinQuantity.fromNumber('1000000');
// const contractValue = StablecoinQuantity.fromNumber('10000');
// const price = Price.fromNumber('0.0000000001', Precision.DYNAMIC);

// const contractShare = ContractShare.fromTotalAndCurrent(fdv, contractValue);
// const contractSize = ContractSize.createFromPrice(contractShare, price, Precision.DYNAMIC);

/// STEP 3

// const contractValue1 = StablecoinQuantity.fromNumber('15000');
// const fdv1 = StablecoinQuantity.fromNumber('5000000');

// const contractShare1 = ContractShare.fromTotalAndCurrent(fdv1, contractValue1);
// const ratio = fdv1.value.div(fdv.value);
// const price1 = contractSize.price.mul(ratio);
// const contractSize1 = ContractSize.createFromPrice(contractShare1, price1, contractSize.unitQuantity.precision)

// const contractValue1 = StablecoinQuantity.fromNumber('15000');
// const price1 = StablecoinQuantity.fromNumber('0.0000000005');

// const contractShare1 = ContractShare.fromTotalAndCurrent(fdv1, contractValue1);
