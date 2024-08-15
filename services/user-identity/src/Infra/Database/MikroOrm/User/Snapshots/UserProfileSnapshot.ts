import { NullableObject } from '@ddd/core';
import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';
import { Country, CountrySnapshot, Email, Telegram } from '@shared/common-internal';

import { UserProfile } from '../../../../../Domain';

@Embeddable()
export class UserProfileSnapshot implements ISnapshot<UserProfile> {
  private constructor() {}

  @Property({ name: 'firstName', nullable: true })
  firstName: string;

  @Property({ name: 'lastName', nullable: true })
  lastName: string;

  @Property({ name: 'telegram', nullable: true, unique: true })
  telegram: string;

  @Property({ name: 'email', nullable: true, unique: true })
  email: string;

  @CountrySnapshot({ fieldName: 'location', nullable: true })
  location: CountrySnapshot;

  applyDomain(domain: UserProfile): void {
    this.firstName = NullableObject.mapNull(domain.firstName);
    this.lastName = NullableObject.mapNull(domain.lastName);
    this.telegram = NullableObject.mapNull(domain.telegram, (telegram) => telegram.value);
    this.email = NullableObject.mapNull(domain.email, (email) => email.value);
    this.location = NullableObject.mapNull(domain.location, (m) => m.id);
  }

  toDomain(): UserProfile {
    const telegram = Telegram.fromSnapshot(this.telegram);
    const email = Email.fromSnapshot(this.email);
    const location = Country.getById(this.location);

    return UserProfile.fromSnapshot(this.firstName, this.lastName, telegram, email, location);
  }
}
