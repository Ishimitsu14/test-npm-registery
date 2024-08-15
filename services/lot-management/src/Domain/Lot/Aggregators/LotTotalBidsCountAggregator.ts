import { Entity, ValueObjectAtomicValue } from '@ddd/domain';
import { Aggregation } from '@ddd/specifications';

import { Lot } from '../Lot';
import { LotPK } from '../LotPK';

export interface LotTotalBidsCountAggregatorResult {
  primaryKey: LotPK;

  count: number;
}

export class LotTotalBidsCountAggregator extends Aggregation<LotTotalBidsCountAggregatorResult[]> {
  readonly pks: LotPK[];

  constructor(items: (Lot | LotPK)[]) {
    super();

    this.pks = items.map((item) => (Entity.isExtends(item) ? item.primaryKey : item));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { pks: this.pks };
  }
}
