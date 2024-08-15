import { Entity, ValueObjectAtomicValue } from '@ddd/domain';
import { Aggregation } from '@ddd/specifications';

import { StablecoinQuantity } from '../../Common';
import { Asset } from '../Asset';
import { AssetPK } from '../AssetPK';

export interface AssetLotStatsAggregatorResult {
  primaryKey: AssetPK;

  averageFdv: StablecoinQuantity;
  lotSellCount: number;
  lotBuyCount: number;
  lotSellCvSum: StablecoinQuantity;
  lotBuyCvSum: StablecoinQuantity;
}

export class AssetLotStatsAggregator extends Aggregation<AssetLotStatsAggregatorResult[]> {
  readonly pks: AssetPK[];

  constructor(items: (AssetPK | Asset)[]) {
    super();

    this.pks = items.map((item) => (Entity.isExtends(item) ? item.primaryKey : item));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { pks: this.pks };
  }
}
