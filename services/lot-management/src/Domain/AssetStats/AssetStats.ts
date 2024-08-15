import { AggregateRoot } from '@ddd/domain';
import Decimal from 'decimal.js';

import { AssetPK } from '../Asset';

export class AssetStats extends AggregateRoot<AssetPK> {
  private readonly _primaryKey: AssetPK;

  private _averageFDV: Decimal;
  private _lotSellCount: Decimal;
  private _lotBuyCount: Decimal;
  private _lotSellContractSizeSummary: Decimal;
  private _lotBuyContractSizeSummary: Decimal;

  private constructor(primaryKey: AssetPK, averageFDV: Decimal, lotSellCount: Decimal, lotBuyCount: Decimal, lotSellContractSizeSummary: Decimal, lotBuyContractSizeSummary: Decimal) {
    super();

    this._primaryKey = primaryKey;

    this._averageFDV = averageFDV;
    this._lotSellCount = lotSellCount;
    this._lotBuyCount = lotBuyCount;
    this._lotSellContractSizeSummary = lotSellContractSizeSummary;
    this._lotBuyContractSizeSummary = lotBuyContractSizeSummary;
  }

  get primaryKey(): AssetPK {
    return this._primaryKey;
  }

  get averageFDV() {
    return this._averageFDV;
  }

  get lotSellCount() {
    return this._lotSellCount;
  }

  get lotBuyCount() {
    return this._lotBuyCount;
  }

  get lotSellContractSizeSummary() {
    return this._lotSellContractSizeSummary;
  }

  get lotBuyContractSizeSummary() {
    return this._lotBuyContractSizeSummary;
  }
}
