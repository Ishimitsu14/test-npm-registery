import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { Precision } from './Precision';
import { Price } from './Price';
import { StablecoinQuantity } from './StablecoinQuantity';
import { UnitQuantity } from './UnitQuantity';

export class TicketQuantity extends ValueObject {
  static fromStablecoinQuantity(stablecoinQuantity: StablecoinQuantity, price: Price, unitQuantityPrecision: Precision) {
    const unitQuantity = UnitQuantity.fromStablecoinQuantity(stablecoinQuantity, price, unitQuantityPrecision);
    return new TicketQuantity(stablecoinQuantity, unitQuantity, price);
  }

  static fromUnitQuantity(unitQuantity: UnitQuantity, price: Price) {
    const stablecoinQuantuty = StablecoinQuantity.fromUnitQuantity(unitQuantity, price);
    return new TicketQuantity(stablecoinQuantuty, unitQuantity, price);
  }

  private constructor(
    readonly stablecoinQuantity: StablecoinQuantity,
    readonly unitQuantity: UnitQuantity,
    readonly price: Price,
  ) {
    super();
  }

  updateStableCoinQuantity(stablecoinQuantity: StablecoinQuantity) {
    return TicketQuantity.fromStablecoinQuantity(stablecoinQuantity, this.price, this.unitQuantity.precision);
  }

  updateUnitQuantity(unitQuantity: UnitQuantity) {
    return TicketQuantity.fromUnitQuantity(unitQuantity, this.price);
  }

  updatePrice(price: Price) {
    return TicketQuantity.fromStablecoinQuantity(this.stablecoinQuantity, price, this.unitQuantity.precision);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.stablecoinQuantity, this.unitQuantity, this.price];
  }
}
