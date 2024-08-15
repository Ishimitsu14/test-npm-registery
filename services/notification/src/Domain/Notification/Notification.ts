import { AggregateRoot } from '@ddd/domain';

import { NotificationPK } from './NotificationPK';

export class Notification extends AggregateRoot<NotificationPK> {
  static create(primaryKey: NotificationPK) {
    return new Notification(primaryKey, false, new Date());
  }

  static fromSnapshot(primaryKey: NotificationPK, isReaded: boolean, createdAt: Date) {
    return new Notification(primaryKey, isReaded, createdAt);
  }

  private _isReaded: boolean;
  private _createdAt: Date;

  protected constructor(
    readonly primaryKey: NotificationPK,
    isReaded: boolean,
    createdAt: Date,
  ) {
    super();

    this._isReaded = isReaded;
    this._createdAt = createdAt;
  }

  get isReaded() {
    return this._isReaded;
  }

  get createdAt() {
    return this._createdAt;
  }

  public makeReaded(isReaded: boolean) {
    this._isReaded = isReaded;
  }
}
