import { createSnapshotFromDomain, ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Collection, Embedded, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { User, UserNickname, UserPK } from '../../../../../Domain';
import { UserRoleSnapshot } from '../../UserRole';
import { UserAuthDataSnapshot } from './UserAuthDataSnapshot';
import { UserProfileSnapshot } from './UserProfileSnapshot';
import { UserVerificationSnapshot } from './UserVerificationSnapshot';

@Entity({ tableName: 'user' })
export class UserSnapshot extends BaseEntity implements ISnapshotEntity<User> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @Property({ name: 'registered_at' })
  registeredAt: Date;

  @Embedded({ entity: () => UserVerificationSnapshot })
  verification: UserVerificationSnapshot;

  @Embedded({ entity: () => UserAuthDataSnapshot })
  auth_data: UserAuthDataSnapshot;

  @Embedded({ entity: () => UserProfileSnapshot })
  profile: UserProfileSnapshot;

  @Property({ name: 'nickname', type: 'varchar', unique: true })
  nickname: string;

  @OneToMany({ entity: () => UserRoleSnapshot, mappedBy: (role) => role.user })
  roles = new Collection<UserRoleSnapshot>(this);

  applyPK(primaryKey: UserPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: User): void {
    this.id = domain.primaryKey.id;
    this.nickname = domain.nickname.value;
    this.registeredAt = domain.registeredAt;

    this.auth_data = createSnapshotFromDomain(UserAuthDataSnapshot, domain.authData);
    this.profile = createSnapshotFromDomain(UserProfileSnapshot, domain.profile);
    this.verification = createSnapshotFromDomain(UserVerificationSnapshot, domain.verification);
  }

  toDomain(): User {
    const userPK = UserPK.raw(this.id);
    const nicknameKey = UserNickname.raw(this.nickname);
    const registeredAt = this.registeredAt;

    const authData = this.auth_data.toDomain();
    const profile = this.profile.toDomain();
    const verification = this.verification.toDomain();

    return User.fromSnapshot(userPK, registeredAt, authData, nicknameKey, profile, verification);
  }
}
