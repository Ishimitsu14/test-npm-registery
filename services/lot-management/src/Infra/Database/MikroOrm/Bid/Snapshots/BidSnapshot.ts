import { NullableObject } from '@ddd/core';
import { ISnapshotEntity } from '@ddd/infra';
import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';
import { Country, CountrySnapshot } from '@shared/common-internal';
import {
  Bid,
  BidMakerPK,
  BidPK,
  BidRejectReason,
  BidStatus,
  InvestorType,
  LotPK,
  MediatorType,
  Precision,
  Price,
  StablecoinQuantity,
  Telegram,
  TradeDirection,
  UnitQuantity,
} from 'services/lot-management/src/Domain';

import { InvestorTypeSnapshot, MediatorTypeSnapshot, TradeDirectionSnapshot } from '../../Common';
import { DealSnapshot } from '../../Deal';
import { LotSnapshot } from '../../Lot';
import { BidRejectReasonSnapshot, BidStatusSnapshot } from './Enums';

@Entity({ tableName: 'bid' })
export class BidSnapshot implements ISnapshotEntity<Bid> {
  @PrimaryKey({ fieldName: 'id' })
  id: number;

  @Property({ fieldName: 'created_at' })
  createdAt: Date;

  @Property({ fieldName: 'bid_maker_id', type: 'varchar' })
  bidMakerId: string;

  @BidStatusSnapshot({ fieldName: 'status' })
  status: BidStatusSnapshot;

  @TradeDirectionSnapshot({ fieldName: 'direction' })
  direction: TradeDirectionSnapshot;

  @InvestorTypeSnapshot({ fieldName: 'bid_maker_type' })
  bidMakerType: InvestorTypeSnapshot;

  @MediatorTypeSnapshot({ fieldName: 'mediator_type' })
  mediatorType: MediatorTypeSnapshot;

  @CountrySnapshot({ fieldName: 'location' })
  location: CountrySnapshot;

  @Property({ fieldName: 'ready_verification', type: 'boolean' })
  readyForVerification: boolean;

  @Property({ fieldName: 'telegram', type: 'varchar' })
  telegram: string;

  @Property({ fieldName: 'deadline', nullable: true })
  deadline?: Date;

  @BidRejectReasonSnapshot({ fieldName: 'reject_reason', nullable: true })
  rejectReason?: BidRejectReasonSnapshot;

  @Property({ fieldName: 'summary', type: 'numeric' })
  summary: string;

  @Property({ fieldName: 'units', type: 'numeric' })
  units: string;

  @Property({ fieldName: 'price', type: 'numeric' })
  price: string;

  @Property({ fieldName: 'fdv', type: 'numeric', nullable: true })
  fdv?: string;

  // References
  @ManyToOne({ entity: () => LotSnapshot, ref: true })
  lot: Ref<LotSnapshot>;

  @OneToOne({ entity: () => DealSnapshot, mappedBy: (deal) => deal.bid, ref: true })
  deal: Ref<DealSnapshot>;

  applyPK(primaryKey: BidPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: Bid): void {
    this.id = domain.primaryKey.id;
    this.lot = Reference.createFromPK(LotSnapshot, domain.lotPK.id);
    this.createdAt = domain.createdAt;
    this.bidMakerId = domain.bidMaker.userId;
    this.status = domain.status.id;
    this.direction = domain.direction.id;
    this.bidMakerType = domain.bidMakerType.id;
    this.mediatorType = domain.mediatorType.id;
    this.location = domain.location.id;
    this.readyForVerification = domain.readyForVerification;
    this.telegram = domain.telegram.value;
    this.deadline = NullableObject.mapNull(domain.deadline);
    this.rejectReason = NullableObject.mapNull(domain.rejectReason, (m) => m.id);
    this.summary = domain.summary.value.toString();
    this.units = NullableObject.mapNull(domain.units, (m) => m.value.toString());
    this.price = NullableObject.mapNull(domain.price, (m) => m.value.toString());
    this.fdv = NullableObject.mapNull(domain.fdv, (m) => m.value.toString());
  }

  toDomain(): Bid {
    return Bid.fromSnapshot(
      BidPK.fromSnapshot(this.id),
      LotPK.fromSnapshot(this.lot.id),
      this.createdAt,
      BidMakerPK.fromSnapshot(this.bidMakerId),
      BidStatus.getById(this.status),
      TradeDirection.getById(this.direction),
      InvestorType.getById(this.bidMakerType),
      MediatorType.getById(this.mediatorType),
      Country.getById(this.location),
      this.readyForVerification,
      Telegram.fromString(this.telegram),
      NullableObject.map(this.deadline),
      NullableObject.map(this.rejectReason, (m) => BidRejectReason.getById(m)),
      StablecoinQuantity.fromNumber(this.summary),
      NullableObject.map(this.units, (m) => UnitQuantity.fromNumber(m, Precision.DYNAMIC)),
      NullableObject.map(this.price, (m) => Price.fromNumber(m, Precision.DYNAMIC)),
      NullableObject.map(this.fdv, (m) => StablecoinQuantity.fromNumber(m)),
    );
  }
}
