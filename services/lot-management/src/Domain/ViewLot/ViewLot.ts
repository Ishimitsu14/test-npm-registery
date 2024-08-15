import { AggregateRoot } from '@ddd/domain';

import { LotPK } from '../Lot';
import { ViewLotPk } from './ViewLotPk';

export class ViewLot extends AggregateRoot<ViewLotPk> {
  static create(id: ViewLotPk, lotId: LotPK) {
    return new ViewLot(id, lotId, new Date());
  }

  static fromSnapshot(id: ViewLotPk, lotId: LotPK, createdAt: Date) {
    return new ViewLot(id, lotId, createdAt);
  }

  readonly primaryKey: ViewLotPk;

  private readonly _lotId: LotPK;
  private readonly _createdAt: Date;

  private constructor(id: ViewLotPk, lotId: LotPK, createdAt: Date) {
    super();

    this.primaryKey = id;

    this._lotId = lotId;
    this._createdAt = createdAt;
  }

  get lotId() {
    return this._lotId;
  }

  get createdAt() {
    return this._createdAt;
  }
}
