import { Nullable, NullableObject } from '@ddd/core';
import { AggregateRoot } from '@ddd/domain';
import { BidCannotCreateWhenLotIsNotActiveError, BidForbiddenAcceptError, BidForbiddenMakeActiveError, BidForbiddenRejectError, BidWithDealCannotRejectError } from '@schema/common';
import { Country } from '@shared/common-internal';

import { BidMakerPK } from '../Actors';
import { InvestorType, MediatorType, Price, StablecoinQuantity, Telegram, TradeDirection, UnitQuantity } from '../Common';
import { Lot, LotPK, LotStatus } from '../Lot';
import { BidPK } from './BidPK';
import { BidRejectReason, BidStatus } from './Enums';
import { BidAcceptedEvent, BidArchivedEvent, BidCreatedEvent, BidMadeActiveEvent, BidRejectedEvent, BidUpdatedEvent } from './Events';

export class Bid extends AggregateRoot<BidPK> {
  static createNewFromLot(
    pk: BidPK,
    lot: Lot,
    bidMaker: BidMakerPK,
    bidMakerType: InvestorType,
    mediatorType: MediatorType,
    location: Country,
    readyForVerification: boolean,
    telegram: Telegram,
    deadline: Nullable<Date>,

    summary: StablecoinQuantity,
    units: Nullable<UnitQuantity>,
    price: Nullable<Price>,
    fdv: StablecoinQuantity,
  ) {
    if (!lot.status.isEquals(LotStatus.ACTIVE)) throw new BidCannotCreateWhenLotIsNotActiveError(lot.primaryKey.id);

    const bid = new Bid(
      pk,
      lot.primaryKey,
      new Date(),
      bidMaker,
      BidStatus.ON_MODERATION,
      lot.direction,
      bidMakerType,
      mediatorType,
      location,
      readyForVerification,
      telegram,
      deadline,
      NullableObject,
      summary,
      units,
      price,
      fdv,
    );
    bid.addEvent(new BidCreatedEvent(bid));

    return bid;
  }

  static fromSnapshot(
    primaryKey: BidPK,
    lotPK: LotPK,
    createdAt: Date,
    bidMaker: BidMakerPK,
    status: BidStatus,
    direction: TradeDirection,
    bidMakerType: InvestorType,
    mediatorType: MediatorType,
    location: Country,
    readyForVerification: boolean,
    telegram: Telegram,
    deadline: Nullable<Date>,
    rejectReason: Nullable<BidRejectReason>,
    summary: StablecoinQuantity,
    units: Nullable<UnitQuantity>,
    price: Nullable<Price>,
    fdv: Nullable<StablecoinQuantity>,
  ) {
    return new Bid(primaryKey, lotPK, createdAt, bidMaker, status, direction, bidMakerType, mediatorType, location, readyForVerification, telegram, deadline, rejectReason, summary, units, price, fdv);
  }

  private _lotPK: LotPK;

  private _createdAt: Date;
  private _bidMaker: BidMakerPK;
  private _status: BidStatus;
  private _direction: TradeDirection;
  private _bidMakerType: InvestorType;
  private _mediatorType: MediatorType;
  private _location: Country;
  private _readyForVerification: boolean;
  private _telegram: Telegram;
  private _deadline: Nullable<Date>;

  private _summary: StablecoinQuantity;
  private _units: Nullable<UnitQuantity>;
  private _price: Nullable<Price>;
  private _fdv: Nullable<StablecoinQuantity>;

  // Only when status === REJECTED
  private _rejectReason: Nullable<BidRejectReason>;

  constructor(
    readonly primaryKey: BidPK,
    lotPK: LotPK,
    createdAt: Date,
    bidMaker: BidMakerPK,
    status: BidStatus,
    direction: TradeDirection,
    bidMakerType: InvestorType,
    mediatorType: MediatorType,
    location: Country,
    readyForVerification: boolean,
    telegram: Telegram,
    deadline: Nullable<Date>,
    rejectReason: Nullable<BidRejectReason>,
    summary: StablecoinQuantity,
    units: Nullable<UnitQuantity>,
    price: Nullable<Price>,
    fdv: Nullable<StablecoinQuantity>,
  ) {
    super();

    this._lotPK = lotPK;
    this._createdAt = createdAt;
    this._bidMaker = bidMaker;
    this._status = status;
    this._direction = direction;
    this._bidMakerType = bidMakerType;
    this._mediatorType = mediatorType;
    this._location = location;
    this._readyForVerification = readyForVerification;
    this._telegram = telegram;
    this._deadline = deadline;
    this._rejectReason = rejectReason;

    this._summary = summary;
    this._units = units;
    this._price = price;
    this._fdv = fdv;
  }

  get lotPK() {
    return this._lotPK;
  }

  get createdAt() {
    return this._createdAt;
  }

  get bidMaker() {
    return this._bidMaker;
  }

  get status() {
    return this._status;
  }

  get direction() {
    return this._direction;
  }

  get bidMakerType() {
    return this._bidMakerType;
  }

  get mediatorType() {
    return this._mediatorType;
  }

  get location() {
    return this._location;
  }

  get readyForVerification() {
    return this._readyForVerification;
  }

  get telegram() {
    return this._telegram;
  }

  get deadline() {
    return this._deadline;
  }

  get rejectReason() {
    return this._rejectReason;
  }

  get summary() {
    return this._summary;
  }

  get units() {
    return this._units;
  }

  get price() {
    return this._price;
  }

  get fdv() {
    return this._fdv;
  }

  update(
    lot: Lot,
    bidMaker: BidMakerPK,
    bidMakerType: InvestorType,
    mediatorType: MediatorType,
    location: Country,
    readyForVerification: boolean,
    telegram: Telegram,
    deadline: Nullable<Date>,

    summary: StablecoinQuantity,
    units: Nullable<UnitQuantity>,
    price: Nullable<Price>,
    fdv: StablecoinQuantity,
  ) {
    this._lotPK = lot.primaryKey;
    this._bidMaker = bidMaker;
    this._bidMakerType = bidMakerType;
    this._mediatorType = mediatorType;
    this._location = location;
    this._readyForVerification = readyForVerification;
    this._telegram = telegram;
    this._deadline = deadline;
    this._summary = summary;
    this._units = units;
    this._price = price;
    this._fdv = fdv;
    this.addEvent(new BidUpdatedEvent(this));
  }

  ensureCanMakeActive() {
    if (!this.canMakeActive()) throw new BidForbiddenMakeActiveError(this.primaryKey.id);
  }

  canMakeActive() {
    return true;
  }

  async makeActive() {
    if (this._status.isEquals(BidStatus.ACTIVE)) return;
    this.ensureCanMakeActive();

    this._status = BidStatus.ACTIVE;
    this.addEvent(new BidMadeActiveEvent(this));
  }

  canAccept() {
    return true;
  }

  ensureCanAccept() {
    if (!this.canAccept()) throw new BidForbiddenAcceptError(this.primaryKey.id);
  }

  accept() {
    if (this._status.isEquals(BidStatus.DEAL)) return;
    this.ensureCanAccept();

    this._status = BidStatus.DEAL;
    this.addEvent(new BidAcceptedEvent(this));
  }

  canReject() {
    return true;
  }

  ensureCanReject() {
    if (!this.canReject()) throw new BidForbiddenRejectError(this.primaryKey.id);
  }

  async reject(rejectReason: BidRejectReason) {
    if (this._status.isEquals(BidStatus.REJECTED)) return;

    this.ensureCanReject();

    if (this._status.isEquals(BidStatus.ON_MODERATION) || this._status.isEquals(BidStatus.ACTIVE)) {
      this._status = BidStatus.REJECTED;
      this._rejectReason = rejectReason;
      this.addEvent(new BidRejectedEvent(this, rejectReason));
    }
  }

  canArchive() {
    return !this._status.isEquals(BidStatus.DEAL);
  }

  ensureCanArchive() {
    if (!this.canArchive()) throw new BidWithDealCannotRejectError(this.primaryKey.id);
  }

  archive() {
    this.ensureCanArchive();

    this._status = BidStatus.ARCHIVED;

    this.addEvent(new BidArchivedEvent(this));
  }
}
