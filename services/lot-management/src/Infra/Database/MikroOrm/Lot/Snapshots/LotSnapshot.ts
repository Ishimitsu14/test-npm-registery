import { createSnapshotFromDomain, ISnapshotEntity } from '@ddd/infra';
import { Collection, Embedded, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { Lot, LotPK, LotStatus, LotType, OfferMakerPK } from '../../../../../Domain';
import { BidSnapshot } from '../../Bid';
import { LotStatusSnapshot, LotTypeSnapshot } from './Enums';
import { LotAttributesSnapshot } from './LotAttributesSnapshot';

@Entity({ tableName: 'lot' })
export class LotSnapshot implements ISnapshotEntity<Lot> {
  @PrimaryKey({ fieldName: 'id', type: 'integer' })
  id: number;

  @Property({ fieldName: 'offer_maker', type: 'varchar' })
  offerMaker: string;

  @LotTypeSnapshot({ fieldName: 'type' })
  type: LotTypeSnapshot;

  @LotStatusSnapshot({ fieldName: 'status' })
  status: LotStatusSnapshot;

  @Embedded({ entity: () => LotAttributesSnapshot })
  attributes: LotAttributesSnapshot;

  @Property({ fieldName: 'score', type: 'integer' })
  score: number;

  // References
  @OneToMany({ entity: () => BidSnapshot, mappedBy: (bid) => bid.lot })
  bids = new Collection<BidSnapshot>(this);

  applyPK(primaryKey: LotPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: Lot): void {
    this.id = domain.primaryKey.id;
    this.offerMaker = domain.offerMaker.userId;
    this.type = domain.type.id;
    this.status = domain.status.id;
    this.attributes = createSnapshotFromDomain(LotAttributesSnapshot, domain.attributes);
    this.score = domain.score;
  }

  toDomain(): Lot {
    return Lot.fromSnapshot(
      LotPK.fromSnapshot(this.id),
      OfferMakerPK.fromSnapshot(this.offerMaker),
      LotType.getById(this.type),
      LotStatus.getById(this.status),
      this.attributes.toDomain(),
      this.score,
    );
  }
}
