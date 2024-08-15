import { AggregateRoot } from '@ddd/domain';

import { UserPK } from '../User/UserPK';
import { UserRoleType } from './Enums';
import { UserRoleAddedEvent } from './Events';
import { UserRolePK } from './UserRolePK';

export class UserRole extends AggregateRoot<UserRolePK> {
  static createNew(primaryKey: UserRolePK, userPK: UserPK, type: UserRoleType) {
    const role = new UserRole(primaryKey, userPK, type, new Date());

    role.addEvent(new UserRoleAddedEvent(role));

    return role;
  }

  static fromSnapshot(primaryKey: UserRolePK, userPK: UserPK, type: UserRoleType, createdAt: Date) {
    return new UserRole(primaryKey, userPK, type, createdAt);
  }

  private readonly _primaryKey: UserRolePK;
  private readonly _createdAt: Date;
  private readonly _type: UserRoleType;
  private readonly _userPK: UserPK;

  private constructor(primaryKey: UserRolePK, userPK: UserPK, type: UserRoleType, createdAt: Date) {
    super();
    this._primaryKey = primaryKey;
    this._createdAt = createdAt;
    this._type = type;
    this._userPK = userPK;
  }

  get primaryKey() {
    return this._primaryKey;
  }

  get userPK() {
    return this._userPK;
  }

  get type() {
    return this._type;
  }

  get createdAt() {
    return this._createdAt;
  }
}
