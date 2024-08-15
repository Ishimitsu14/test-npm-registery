import { ListCollection, NullableObject } from '@ddd/core';
import { createSnapshotFromDomain, ISnapshotEntity } from '@ddd/infra';
import { Collection, Embedded, Entity, OneToMany, OneToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { BidMakerPK, BidPK, Deal, DealPK, DealStatus, OfferMakerPK, Precision, Price, StablecoinQuantity, UnitQuantity } from '../../../../../Domain';
import { BidSnapshot } from '../../Bid';
import { DealTransactionSnapshot } from '../../DealTransaction';
import { DealKeyResultsSnapshot } from './DealKeyResultsSnapshot';
import { DealStatusSnapshot } from './Enums';

@Entity({ tableName: 'deal' })
export class DealSnapshot implements ISnapshotEntity<Deal> {
  @PrimaryKey({ fieldName: 'id', type: 'integer' })
  id: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date;

  @DealStatusSnapshot({ fieldName: 'status' })
  status: DealStatusSnapshot;

  @Property({ fieldName: 'offer_makers', type: 'array' })
  offerMakers: string[];

  @Property({ fieldName: 'bid_makers', type: 'array' })
  bidMakers: string[];

  @Embedded({ entity: () => DealKeyResultsSnapshot })
  kr: DealKeyResultsSnapshot;

  @Property({ fieldName: 'summary', type: 'numeric' })
  summary: string;

  @Property({ fieldName: 'units', type: 'numeric' })
  units: string;

  @Property({ fieldName: 'price', type: 'numeric' })
  price: string;

  @Property({ fieldName: 'fdv', type: 'numeric', nullable: true })
  fdv?: string;

  // References
  @OneToOne({ entity: () => BidSnapshot, mappedBy: (bid) => bid.deal, owner: true, ref: true })
  bid: Ref<BidSnapshot>;

  @OneToMany({ entity: () => DealTransactionSnapshot, mappedBy: (transaction) => transaction.deal })
  transactions = new Collection<DealTransactionSnapshot>(this);

  applyPK(primaryKey: DealPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: Deal): void {
    this.id = domain.primaryKey.id;
    this.bid = Reference.createFromPK(BidSnapshot, domain.bidPK.id);
    this.createdAt = domain.createdAt;
    this.status = domain.status.id;
    this.offerMakers = domain.offerMakers.items.map((item) => item.userId);
    this.bidMakers = domain.bidMakers.items.map((item) => item.userId);
    this.kr = createSnapshotFromDomain(DealKeyResultsSnapshot, domain.keyResults);
    this.summary = domain.summary.value.toString();
    this.units = NullableObject.mapNull(domain.units, (m) => m.value.toString());
    this.price = NullableObject.mapNull(domain.price, (m) => m.value.toString());
    this.fdv = NullableObject.mapNull(domain.fdv, (m) => m.value.toString());
  }

  toDomain(): Deal {
    return Deal.fromSnapshot(
      DealPK.fromSnapshot(this.id),
      BidPK.fromSnapshot(this.bid.id),
      this.createdAt,
      DealStatus.getById(this.status),
      new ListCollection(this.offerMakers.map((item) => OfferMakerPK.fromSnapshot(item))),
      new ListCollection(this.bidMakers.map((item) => BidMakerPK.fromSnapshot(item))),
      this.kr.toDomain(),
      StablecoinQuantity.fromNumber(this.summary),
      NullableObject.map(this.units, (m) => UnitQuantity.fromNumber(m, Precision.DYNAMIC)),
      NullableObject.map(this.price, (m) => Price.fromNumber(m, Precision.DYNAMIC)),
      NullableObject.map(this.fdv, (m) => StablecoinQuantity.fromNumber(m)),
    );
  }
}
