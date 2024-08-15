import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { TradeDirection } from '../../Common';
import { Lot } from '../Lot';

export class LotByDirectionSpecification extends Specification<Lot> {
  readonly directions: TradeDirection[];

  constructor(direction: TradeDirection | TradeDirection[]) {
    super();

    this.directions = Array.isArray(direction) ? direction : [direction];

    this.addFilter((lot) => {
      return this.directions.indexOf(lot.direction) !== -1;
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.directions];
  }
}
