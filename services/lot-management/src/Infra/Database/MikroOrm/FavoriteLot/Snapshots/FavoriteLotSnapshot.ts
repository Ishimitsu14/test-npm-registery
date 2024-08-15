import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { FavoriteLot, FavoriteLotPK, LotPK, UserPK } from '../../../../../Domain';
import { LotSnapshot } from '../../Lot';

@Entity({ tableName: 'favorite_lot' })
export class FavoriteLotSnapshot extends BaseEntity implements ISnapshotEntity<FavoriteLot> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @Property({ fieldName: 'user_id', type: 'varchar' })
  userId: string;

  @ManyToOne({ entity: () => LotSnapshot, ref: true })
  lot: Ref<LotSnapshot>;

  @Property({ name: 'created_at' })
  createdAt: Date;

  applyPK(primaryKey: FavoriteLotPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: FavoriteLot): void {
    this.id = domain.primaryKey.id;
    this.userId = domain.userPK.id;
    this.lot = Reference.createFromPK(LotSnapshot, domain.lotPK.id);
    this.createdAt = domain.createdAt;
  }

  toDomain(): FavoriteLot {
    return FavoriteLot.fromSnapshot(FavoriteLotPK.raw(this.id), UserPK.raw(this.userId), LotPK.fromSnapshot(this.lot.id), this.createdAt);
  }
}
