import { Entity, ValueObjectAtomicValue } from '@ddd/domain';
import { Aggregation } from '@ddd/specifications';

import { StablecoinQuantity } from '../../Common';
import { Lot } from '../Lot';
import { LotPK } from '../LotPK';

export interface LotTransactionStatsAggregatorResult {
  primaryKey: LotPK;

  executed: StablecoinQuantity;
  reserved: StablecoinQuantity;
  available: StablecoinQuantity;
  total: StablecoinQuantity;
}

export class LotTransactionStatsAggregator extends Aggregation<LotTransactionStatsAggregatorResult[]> {
  readonly pks: LotPK[];

  constructor(items: (Lot | LotPK)[]) {
    super();

    this.pks = items.map((item) => (Entity.isExtends(item) ? item.primaryKey : item));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { pks: this.pks };
  }
}
