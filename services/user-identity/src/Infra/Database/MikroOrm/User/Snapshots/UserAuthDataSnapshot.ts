import { NullableObject } from '@ddd/core';
import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';
import { EvmPublicAddress } from '@shared/common-internal';

import { UserAuthData } from '../../../../../Domain';

@Embeddable()
export class UserAuthDataSnapshot implements ISnapshot<UserAuthData> {
  private constructor() {}

  @Property({ name: 'address', nullable: true })
  address?: string;

  applyDomain(domain: UserAuthData): void {
    this.address = NullableObject.mapNull(domain.address, (m) => m.value);
  }

  toDomain(): UserAuthData {
    const address = NullableObject.map(this.address, (m) => EvmPublicAddress.fromSnapshot(m));

    return UserAuthData.fromSnapshot(address);
  }
}
