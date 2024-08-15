import { NullableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { User } from '../User';

export class UserBySearchSpecification extends Specification<User> {
  constructor(readonly search: string) {
    super();

    this.addFilter((user) => {
      const fields = [NullableObject.hasValue(user.profile.telegram) ? user.profile.telegram.value : '', user.profile.firstName, user.profile.lastName].filter(Boolean);

      return fields.map((field) => field.toString().toLowerCase()).some((field) => field.includes(this.search));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.search];
  }
}
