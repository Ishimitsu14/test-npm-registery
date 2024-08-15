import { Nullable, NullableObject } from '@ddd/core';
import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { AuthTelegramCode, AuthTelegramCodePK, UserPK } from '../../../../../Domain';
import { UserSnapshot } from '../../User';

@Entity({ tableName: 'auth_telegram_code' })
export class AuthTelegramCodeSnapshot extends BaseEntity implements ISnapshotEntity<AuthTelegramCode> {
  private constructor() {
    super();
  }

  @PrimaryKey({ fieldName: 'code', type: 'varchar' })
  code: string;

  @Property({ fieldName: 'expires_at' })
  expiresAt: Date;

  @ManyToOne({ entity: () => UserSnapshot, nullable: true, ref: true })
  userPK?: Nullable<Ref<UserSnapshot>>;

  applyPK(primaryKey: AuthTelegramCodePK): void {
    this.code = primaryKey.code;
  }

  applyDomain(domain: AuthTelegramCode): void {
    this.code = domain.primaryKey.code;
    this.expiresAt = domain.expiresAt;
    this.userPK = NullableObject.mapNull(domain.userPK, (v) => Reference.createFromPK(UserSnapshot, v.id));
  }

  toDomain(): AuthTelegramCode {
    const primaryKey = AuthTelegramCodePK.fromSnapshot(this.code);
    const expiresAt = this.expiresAt;
    const userPK = NullableObject.mapNull(this.userPK, (v) => UserPK.fromSnapshot(v.id));

    return AuthTelegramCode.fromSnapshot(primaryKey, expiresAt, userPK);
  }
}
