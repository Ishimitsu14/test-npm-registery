import { Nullable } from '@ddd/core';
import { AggregateRoot } from '@ddd/domain';

import { UserPK } from '../Actors';
import { LotPK } from '../Lot';
import { LotQuestionStatus } from './Enums';
import { LotQuestionApprovedEvent } from './Events';
import { LotQuestionPK } from './LotQuestionPK';

export class LotQuestion extends AggregateRoot<LotQuestionPK> {
  static createNew(primaryKey: LotQuestionPK, userPK: UserPK, lotPK: LotPK, text: string, parentLotQuestionPK: Nullable<LotQuestionPK>) {
    return new LotQuestion(primaryKey, userPK, lotPK, text, parentLotQuestionPK, LotQuestionStatus.ON_MODERATION, new Date());
  }

  static fromSnapshot(primaryKey: LotQuestionPK, userPK: UserPK, lotPK: LotPK, text: string, parentLotQuestionPK: Nullable<LotQuestionPK>, status: LotQuestionStatus, createdAt: Date) {
    return new LotQuestion(primaryKey, userPK, lotPK, text, parentLotQuestionPK, status, createdAt);
  }

  readonly primaryKey: LotQuestionPK;

  private readonly _userPK: UserPK;
  private readonly _lotPK: LotPK;
  private readonly _parentLotQuestionPK: Nullable<LotQuestionPK>;

  private _text: string;
  private _status: LotQuestionStatus;
  private _createdAt: Date;

  private constructor(primaryKey: LotQuestionPK, userPK: UserPK, lotPK: LotPK, text: string, parentLotQuestionPK: Nullable<LotQuestionPK>, status: LotQuestionStatus, createdAt: Date) {
    super();

    this.primaryKey = primaryKey;

    this._lotPK = lotPK;
    this._userPK = userPK;
    this._text = text;
    this._parentLotQuestionPK = parentLotQuestionPK;
    this._status = status;
    this._createdAt = createdAt;
  }

  get userPK() {
    return this._userPK;
  }

  get lotPK() {
    return this._lotPK;
  }

  get text() {
    return this._text;
  }

  get parentLotQuestionPK() {
    return this._parentLotQuestionPK;
  }

  get status() {
    return this._status;
  }

  get createdAt() {
    return this._createdAt;
  }

  approve() {
    if (this._status.isEquals(LotQuestionStatus.ACTIVE)) return;

    this._status = LotQuestionStatus.ACTIVE;
    this.addEvent(new LotQuestionApprovedEvent(this));
  }

  reject() {
    if (this._status.isEquals(LotQuestionStatus.REJECTED)) return;

    this._status = LotQuestionStatus.REJECTED;
  }
}
