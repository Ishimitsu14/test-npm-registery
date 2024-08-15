import { ListCollection, Nullable, ReadonlyListCollection } from '@ddd/core';
import { AggregateRoot, StateObjectUpdateCallback } from '@ddd/domain';
import { LotInvalidStateError } from '@schema/common';

import { BidMakerPK, OfferMakerPK } from '../Actors';
import { Bid, BidPK } from '../Bid';
import { Price, StablecoinQuantity, UnitQuantity } from '../Common';
import { Lot } from '../Lot';
import { DealPK } from './DealPK';
import { DealStatus } from './Enums';
import { DealCompletedEvent, DealCreatedEvent, DealRejectedEvent, DealUpdatedKeyResultsEvent } from './Events';
import { DealKeyResults } from './ValueObjects';

export class Deal extends AggregateRoot<DealPK> {
  static createNewFromLotAndBid(dealPK: DealPK, lot: Lot, bid: Bid) {
    if (!lot.primaryKey.isEquals(bid.lotPK)) throw new LotInvalidStateError('lotPK not equals bid.lotPK');

    const deal = new Deal(
      dealPK,
      bid.primaryKey,
      new Date(),
      DealStatus.NEGOTIATION,
      new ListCollection([lot.offerMaker]),
      new ListCollection([bid.bidMaker]),
      DealKeyResults.createEmpty(),
      bid.summary,
      bid.units,
      bid.price,
      bid.fdv,
    );
    deal.addEvent(new DealCreatedEvent(deal));

    return deal;
  }

  static fromSnapshot(
    primaryKey: DealPK,
    bidPK: BidPK,
    createdAt: Date,
    status: DealStatus,
    offerMakers: ReadonlyListCollection<OfferMakerPK>,
    bidMakers: ReadonlyListCollection<BidMakerPK>,
    keyResults: DealKeyResults,
    summary: StablecoinQuantity,
    units: Nullable<UnitQuantity>,
    price: Nullable<Price>,
    fdv: Nullable<StablecoinQuantity>,
  ) {
    return new Deal(primaryKey, bidPK, createdAt, status, offerMakers, bidMakers, keyResults, summary, units, price, fdv);
  }

  readonly primaryKey: DealPK;

  private readonly _bidPK: BidPK;
  private _createdAt: Date;
  private _status: DealStatus;
  private _offerMakers: ListCollection<OfferMakerPK>;
  private _bidMakers: ListCollection<BidMakerPK>;
  private _keyResults: DealKeyResults;

  private _summary: StablecoinQuantity;
  private _units: Nullable<UnitQuantity>;
  private _price: Nullable<Price>;
  private _fdv: Nullable<StablecoinQuantity>;

  private constructor(
    primaryKey: DealPK,
    bidPK: BidPK,
    createdAt: Date,
    status: DealStatus,
    offerMakers: ReadonlyListCollection<OfferMakerPK>,
    bidMakers: ReadonlyListCollection<BidMakerPK>,
    keyResults: DealKeyResults,
    summary: StablecoinQuantity,
    units: Nullable<UnitQuantity>,
    price: Nullable<Price>,
    fdv: Nullable<StablecoinQuantity>,
  ) {
    super();

    this.primaryKey = primaryKey;

    this._bidPK = bidPK;
    this._createdAt = createdAt;
    this._status = status;
    this._offerMakers = new ListCollection(offerMakers);
    this._bidMakers = new ListCollection(bidMakers);
    this._keyResults = keyResults;
    this._summary = summary;
    this._units = units;
    this._price = price;
    this._fdv = fdv;
  }

  get bidPK() {
    return this._bidPK;
  }

  get createdAt() {
    return this._createdAt;
  }

  get status() {
    return this._status;
  }

  get keyResults() {
    return this._keyResults;
  }

  get offerMakers() {
    return this._offerMakers.asReadonly();
  }

  get bidMakers() {
    return this._bidMakers.asReadonly();
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

  updateKeyResult(callback: StateObjectUpdateCallback<DealKeyResults>) {
    const prevKeyResults = this._keyResults;
    this._keyResults = typeof callback === 'function' ? callback(this._keyResults) : callback;

    if (!this._keyResults.isEquals(prevKeyResults)) {
      this.addEvent(new DealUpdatedKeyResultsEvent(this, prevKeyResults));
    }
  }

  complete() {
    if (this._status.isEquals(DealStatus.COMPLETED)) return;

    if (this._status.isEquals(DealStatus.NEGOTIATION)) {
      this._status = DealStatus.COMPLETED;
      this.addEvent(new DealCompletedEvent(this));
    }
  }

  reject() {
    if (this._status.isEquals(DealStatus.REJECTED)) return;

    if (this._status.isEquals(DealStatus.NEGOTIATION)) {
      this._status = DealStatus.REJECTED;
      this.addEvent(new DealRejectedEvent(this));
    }
  }
}
