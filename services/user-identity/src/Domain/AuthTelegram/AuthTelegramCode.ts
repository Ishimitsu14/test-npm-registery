import { Nullable, NullableObject } from '@ddd/core';
import { AggregateRoot } from '@ddd/domain';

import { UserPK } from '../User';
import { AuthTelegramCodePK } from './AuthTelegramCodePK';

export class AuthTelegramCode extends AggregateRoot<AuthTelegramCodePK> {
  static create(primaryKey: AuthTelegramCodePK, expiresAt: Date) {
    return new AuthTelegramCode(primaryKey, expiresAt, NullableObject);
  }

  static fromSnapshot(primaryKey: AuthTelegramCodePK, expiresAt: Date, userPK: Nullable<UserPK>) {
    return new AuthTelegramCode(primaryKey, expiresAt, userPK);
  }

  readonly expiresAt: Date;
  private _userPK: Nullable<UserPK>;

  private constructor(
    readonly primaryKey: AuthTelegramCodePK,
    expiresAt: Date,
    userPK: Nullable<UserPK>,
  ) {
    super();
    this.expiresAt = expiresAt;
    this._userPK = userPK;
  }

  get userPK() {
    return this._userPK;
  }

  setUserPK(userPK: UserPK) {
    this._userPK = userPK;
  }

  get isExpired() {
    const currentDate = new Date();
    return currentDate.getTime() > this.expiresAt.getTime();
  }
}
