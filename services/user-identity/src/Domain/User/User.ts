import { AggregateRoot } from '@ddd/domain';

import { UserProfileUpdatedEvent } from './Events';
import { UserAuthData } from './UserAuthData';
import { UserNickname } from './UserNicknameKey';
import { UserPK } from './UserPK';
import { UserProfile } from './UserProfile';
import { UserVerification } from './UserVerification';

export class User extends AggregateRoot<UserPK> {
  static createNew(primaryKey: UserPK, authData: UserAuthData, nickname: UserNickname, profile: UserProfile, verification: UserVerification) {
    const user = new User(primaryKey, new Date(), authData, nickname, profile, verification);

    return user;
  }

  static fromSnapshot(primaryKey: UserPK, registeredAt: Date, authData: UserAuthData, nicknameKey: UserNickname, profile: UserProfile, verification: UserVerification) {
    return new User(primaryKey, registeredAt, authData, nicknameKey, profile, verification);
  }

  private readonly _primaryKey: UserPK;
  private readonly _registeredAt: Date;
  private readonly _authData: UserAuthData;

  private _nickname: UserNickname;
  private _profile: UserProfile;
  private _verification: UserVerification;

  private constructor(primaryKey: UserPK, registeredAt: Date, authData: UserAuthData, nickname: UserNickname, profile: UserProfile, verification: UserVerification) {
    super();
    this._primaryKey = primaryKey;
    this._registeredAt = registeredAt;
    this._authData = authData;

    this._nickname = nickname;
    this._profile = profile;
    this._verification = verification;
  }

  get primaryKey() {
    return this._primaryKey;
  }

  get registeredAt() {
    return this._registeredAt;
  }

  get authData() {
    return this._authData;
  }

  get nickname() {
    return this._nickname;
  }

  get profile() {
    return this._profile;
  }

  get verification() {
    return this._verification;
  }

  updateProfile(data: UserProfile | ((profile: UserProfile) => UserProfile)) {
    const prevProfile = this._profile;
    this._profile = UserProfile.isExtends(data) ? data : data(this._profile);

    if (!prevProfile.isEquals(this._profile)) {
      this.addEvent(new UserProfileUpdatedEvent(this, prevProfile));
    }
  }

  updateVerification(data: UserVerification | ((verification: UserVerification) => UserVerification)) {
    this._verification = UserVerification.isExtends(data) ? data : data(this._verification);
  }
}
