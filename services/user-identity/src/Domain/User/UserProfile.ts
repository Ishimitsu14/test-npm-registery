import { Nullable, NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { Country, Email, Telegram } from '@shared/common-internal';

export class UserProfile extends ValueObject {
  static create(firstName: Nullable<string>, lastName: Nullable<string>, telegram: Nullable<Telegram>, email: Nullable<Email>, location: Nullable<Country>) {
    return new UserProfile(firstName, lastName, telegram, email, location);
  }

  static createEmpty() {
    return new UserProfile(NullableObject, NullableObject, NullableObject, NullableObject, NullableObject);
  }

  static fromSnapshot(firstName: Nullable<string>, lastName: Nullable<string>, telegram: Nullable<Telegram>, email: Nullable<Email>, location: Nullable<Country>) {
    return new UserProfile(firstName, lastName, telegram, email, location);
  }

  private constructor(
    readonly firstName: Nullable<string>,
    readonly lastName: Nullable<string>,
    readonly telegram: Nullable<Telegram>,
    readonly email: Nullable<Email>,
    readonly location: Nullable<Country>,
  ) {
    super();
  }

  setFirstName(firstName: Nullable<string>) {
    return new UserProfile(firstName, this.lastName, this.telegram, this.email, this.location);
  }

  setLastName(lastName: Nullable<string>) {
    return new UserProfile(this.firstName, lastName, this.telegram, this.email, this.location);
  }

  setTelegram(telegram: Nullable<Telegram>) {
    return new UserProfile(this.firstName, this.lastName, telegram, this.email, this.location);
  }

  setEmail(email: Nullable<Email>) {
    return new UserProfile(this.firstName, this.lastName, this.telegram, email, this.location);
  }

  setLocation(location: Nullable<Country>) {
    return new UserProfile(this.firstName, this.lastName, this.telegram, this.email, location);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      telegram: this.telegram,
      email: this.email,
      location: this.location,
    };
  }
}
