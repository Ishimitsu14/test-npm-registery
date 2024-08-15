import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { LotBadge, LotBadgePK } from '../../../../../Domain';

@Entity({ tableName: 'lot_badge' })
export class LotBadgeSnapshot extends BaseEntity implements ISnapshotEntity<LotBadge> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @Property({ name: 'sort' })
  sort: number;

  @Property({ name: 'created_at' })
  createdAt: Date;

  applyPK(primaryKey: LotBadgePK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: LotBadge): void {
    this.id = domain.primaryKey.id;
    this.sort = domain.sort;
    this.createdAt = domain.createdAt;
  }

  toDomain(): LotBadge {
    const lotBadgePk = new LotBadgePK(this.id);

    return LotBadge.fromSnapshot(lotBadgePk, this.sort, this.createdAt);
  }
}
