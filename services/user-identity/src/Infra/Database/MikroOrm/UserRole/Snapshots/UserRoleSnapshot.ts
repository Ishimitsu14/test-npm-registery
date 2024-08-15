import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { UserPK, UserRole, UserRolePK, UserRoleType } from '../../../../../Domain';
import { UserSnapshot } from '../../User';
import { UserRoleTypeSnapshot } from './Enums';

@Entity({ tableName: 'user_role' })
export class UserRoleSnapshot extends BaseEntity implements ISnapshotEntity<UserRole> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @ManyToOne({ entity: () => UserSnapshot, ref: true })
  user: Ref<UserSnapshot>;

  @UserRoleTypeSnapshot({ fieldName: 'type' })
  type: UserRoleTypeSnapshot;

  @Property({ name: 'created_at' })
  createdAt: Date;

  applyPK(primaryKey: UserRolePK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: UserRole): void {
    this.id = domain.primaryKey.id;
    this.user = Reference.createFromPK(UserSnapshot, domain.userPK.id);
    this.type = domain.type.id;
    this.createdAt = domain.createdAt;
  }

  toDomain(): UserRole {
    return UserRole.fromSnapshot(UserRolePK.raw(this.id), UserPK.raw(this.user.id), UserRoleType.getById(this.type), this.createdAt);
  }
}
