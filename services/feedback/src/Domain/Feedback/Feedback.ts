import { AggregateRoot } from '@ddd/domain';

import { FeedbackPK } from './FeedbackPK';

export class Feedback extends AggregateRoot<FeedbackPK> {
  static create(primaryKey: FeedbackPK, text: string, page: string, rating: number, userPk: string) {
    return new Feedback(primaryKey, text, page, rating, userPk, new Date());
  }

  static fromSnapshot(primaryKey: FeedbackPK, text: string, page: string, rating: number, userPk: string, createdAt: Date) {
    return new Feedback(primaryKey, text, page, rating, userPk, createdAt);
  }

  private readonly _primaryKey: FeedbackPK;

  private _text: string;
  private _page: string;
  private _rating: number;
  private _userPk: string;

  private readonly _createdAt: Date;

  private constructor(primaryKey: FeedbackPK, text: string, page: string, rating: number, userPk: string, createdAt: Date) {
    super();
    this._primaryKey = primaryKey;
    this._text = text;
    this._page = page;
    this._rating = rating;
    this._userPk = userPk;
    this._createdAt = createdAt;
  }

  get primaryKey() {
    return this._primaryKey;
  }

  get text() {
    return this._text;
  }

  get page() {
    return this._page;
  }

  get rating() {
    return this._rating;
  }

  get userPk() {
    return this._userPk;
  }

  get createdAt() {
    return this._createdAt;
  }
}
