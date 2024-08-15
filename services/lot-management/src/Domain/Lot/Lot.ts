import { NullableObject } from '@ddd/core';
import { AggregateRoot } from '@ddd/domain';

import { OfferMakerPK } from '../Actors';
import { AttributeValueListCollection } from './Abstract';
import { LotAttributes } from './Attributes';
import { LotCompletedReasonType, LotRejectReason, LotStatus, LotType } from './Enums';
import {
  LotArchivedEvent,
  LotCancelledModerationEvent,
  LotChangedCategoryEvent,
  LotCompletedEvent,
  LotCreatedEvent,
  LotHasBeenDuplicatedEvent,
  LotMadeActiveEvent,
  LotRejectedEvent,
  LotSentOnModerationEvent,
  LotUpdatedAttributesEvent,
} from './Events';
import { LotInputs } from './Inputs';
import { LotPK } from './LotPK';

export class Lot extends AggregateRoot<LotPK> {
  static HOT_SCORE = 70;

  static createDraft(pk: LotPK, offerMaker: OfferMakerPK, type: LotType, attributes: AttributeValueListCollection) {
    const lot = new Lot(pk, offerMaker, type, LotStatus.DRAFT, new AttributeValueListCollection(), 0);

    lot.updateAttributes(attributes);
    lot.addEvent(new LotCreatedEvent(lot));

    return lot;
  }

  static fromSnapshot(
    pk: LotPK,

    offerMaker: OfferMakerPK,
    type: LotType,
    status: LotStatus,
    attributes: AttributeValueListCollection,
    score: number,
  ) {
    return new Lot(pk, offerMaker, type, status, attributes, score);
  }

  readonly primaryKey: LotPK;

  // Common
  private _offerMaker: OfferMakerPK;
  private _status: LotStatus;
  private _type: LotType;
  private _attributes: AttributeValueListCollection;
  private _score: number;

  constructor(
    pk: LotPK,

    offerMaker: OfferMakerPK,
    type: LotType,
    status: LotStatus,
    attributes: AttributeValueListCollection,
    score: number,
  ) {
    super();

    this.primaryKey = pk;

    this._offerMaker = offerMaker;
    this._status = status;
    this._type = type;
    this._attributes = attributes;
    this._score = score;
  }

  get createdAt() {
    return this._attributes.findValueStrict(LotAttributes.COMMON_CREATED_AT_ATTRIBUTE);
  }

  get offerMaker() {
    return this._offerMaker;
  }

  get status() {
    return this._status;
  }

  get type() {
    return this._type;
  }

  get strategy() {
    return this._type.categoryStrategy;
  }

  get attributes() {
    return this._attributes.clone();
  }

  get telegram() {
    return this._attributes.findValue(LotInputs.COMMON_TELEGRAM_INPUT);
  }

  get offerMakerTypes() {
    return NullableObject.map(this._attributes.findValue(LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT), (m) => m);
  }

  get bidMakerTypes() {
    return NullableObject.map(this._attributes.findValue(LotInputs.COMMON_BID_MAKER_TYPES_INPUT), (m) => m);
  }

  get direction() {
    return this._attributes.findValueStrict(LotInputs.COMMON_DIRECTION_INPUT);
  }

  get deadline() {
    return this._attributes.findValue(LotInputs.COMMON_DEADLINE_INPUT);
  }

  get mediatorType() {
    return this._attributes.findValue(LotInputs.COMMON_MEDIATOR_INPUT);
  }

  get sendOnModerationAt() {
    return this._attributes.findValue(LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE);
  }

  get archivedAt() {
    return this._attributes.findValue(LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE);
  }

  get rejectedAt() {
    return this._attributes.findValue(LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE);
  }

  get publishedAt() {
    return this._attributes.findValue(LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE);
  }

  get price() {
    return NullableObject.map(this._attributes.findValue(LotInputs.COMMON_PRICE_INPUT));
  }

  get score() {
    return this._score;
  }

  get isHot() {
    return this._score > Lot.HOT_SCORE;
  }

  get summary() {
    return this._attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);
  }

  changeCategoryStrategy(newLotType: LotType, newAttributes: AttributeValueListCollection) {
    if (!this._type.isEquals(newLotType)) {
      const prevType = this._type;
      this._attributes = newLotType.categoryStrategy.changeStrategy(this._status, prevType.categoryStrategy, this._attributes, newAttributes);
      this._type = newLotType;

      this.addEvent(new LotChangedCategoryEvent(this, prevType));
    } else {
      this.updateAttributes(newAttributes);
    }
  }

  updateAttributes(newAttributes: AttributeValueListCollection) {
    const prevAttributes = this._attributes;
    this._attributes = this._type.categoryStrategy.updateAttributes(this._status, this._attributes, newAttributes);

    if (!this._attributes.isEquals(prevAttributes)) {
      this.addEvent(new LotUpdatedAttributesEvent(this, prevAttributes));
    }
  }

  updateScore(score: number) {
    this._score = score;
  }

  duplicate(lotPK: LotPK) {
    const newLot = Lot.createDraft(lotPK, this.offerMaker, this.type, this._attributes);

    this.addEvent(new LotHasBeenDuplicatedEvent(this, newLot));

    return newLot;
  }

  cancelModeration() {
    if (this._status.isEquals(LotStatus.DRAFT)) return;

    this._attributes = this._type.categoryStrategy.updateAttributes(LotStatus.DRAFT, this._attributes, new AttributeValueListCollection());
    this._status = LotStatus.DRAFT;

    this.addEvent(new LotCancelledModerationEvent(this));
  }

  sendOnModeration() {
    if (this._status.isEquals(LotStatus.ON_MODERATION)) return;

    this._attributes = this._type.categoryStrategy.updateAttributes(LotStatus.ON_MODERATION, this._attributes, new AttributeValueListCollection());
    this._status = LotStatus.ON_MODERATION;

    this.addEvent(new LotSentOnModerationEvent(this));
  }

  makeActive() {
    if (this._status.isEquals(LotStatus.ACTIVE)) return;

    this._attributes = this._type.categoryStrategy.updateAttributes(LotStatus.ACTIVE, this._attributes, new AttributeValueListCollection());
    this._status = LotStatus.ACTIVE;

    this.addEvent(new LotMadeActiveEvent(this));
  }

  complete(reason: LotCompletedReasonType) {
    if (this._status.isEquals(LotStatus.COMPLETED)) return;

    this._attributes = this._type.categoryStrategy.updateAttributes(
      LotStatus.COMPLETED,
      this._attributes,
      new AttributeValueListCollection([LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE.createValue(reason)]),
    );
    this._status = LotStatus.COMPLETED;

    this.addEvent(new LotCompletedEvent(this));
  }

  archive() {
    if (this._status.isEquals(LotStatus.ARCHIVED)) return;

    this._attributes = this._type.categoryStrategy.updateAttributes(LotStatus.ARCHIVED, this._attributes, new AttributeValueListCollection());
    this._status = LotStatus.ARCHIVED;

    this.addEvent(new LotArchivedEvent(this));
  }

  reject() {
    if (this._status.isEquals(LotStatus.REJECTED)) return;

    this._attributes = this._type.categoryStrategy.updateAttributes(
      LotStatus.REJECTED,
      this._attributes,
      new AttributeValueListCollection([LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE.createValue(LotRejectReason.INVALID_DATA)]),
    );
    this._status = LotStatus.REJECTED;

    this.addEvent(new LotRejectedEvent(this));
  }
}
