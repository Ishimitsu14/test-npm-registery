import { AggregateRoot } from '@ddd/domain';

import { UserPK } from '../Actors';
import { LotPK } from '../Lot';
import { FavoriteLotAddedEvent } from './Events';
import { FavoriteLotPK } from './FavoriteLotPK';

export class FavoriteLot extends AggregateRoot<FavoriteLotPK> {
  static createNew(primaryKey: FavoriteLotPK, userPK: UserPK, lotPK: LotPK) {
    const favoriteLot = new FavoriteLot(primaryKey, userPK, lotPK, new Date());

    favoriteLot.addEvent(new FavoriteLotAddedEvent(favoriteLot));

    return favoriteLot;
  }

  static fromSnapshot(primaryKey: FavoriteLotPK, userPK: UserPK, lotPK: LotPK, createdAt: Date) {
    return new FavoriteLot(primaryKey, userPK, lotPK, createdAt);
  }

  readonly primaryKey: FavoriteLotPK;

  private readonly _userPK: UserPK;
  private readonly _lotPK: LotPK;

  private _createdAt: Date;

  private constructor(primaryKey: FavoriteLotPK, userPK: UserPK, lotPK: LotPK, createdAt: Date) {
    super();

    this.primaryKey = primaryKey;

    this._lotPK = lotPK;
    this._userPK = userPK;
    this._createdAt = createdAt;
  }

  get userPK() {
    return this._userPK;
  }

  get lotPK() {
    return this._lotPK;
  }

  get createdAt() {
    return this._createdAt;
  }
}
