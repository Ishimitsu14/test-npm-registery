import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { LotPK, ViewLot, ViewLotPk } from '../../../../../Domain';

@Entity({ tableName: 'view_lot' })
export class ViewLotSnapshot extends BaseEntity implements ISnapshotEntity<ViewLot> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @Property({ name: 'lot_id' })
  lotId: number;

  @Property({ name: 'created_at' })
  createdAt: Date;

  applyPK(primaryKey: ViewLotPk) {
    this.id = primaryKey.id;
  }

  applyDomain(domain: ViewLot) {
    this.id = domain.primaryKey.id;
    this.lotId = domain.lotId.id;
    this.createdAt = domain.createdAt;
  }

  toDomain(): ViewLot {
    const viewLotPk = ViewLotPk.raw(this.id);
    const lotPk = LotPK.fromSnapshot(this.lotId);

    return ViewLot.fromSnapshot(viewLotPk, lotPk, this.createdAt);
  }
}
