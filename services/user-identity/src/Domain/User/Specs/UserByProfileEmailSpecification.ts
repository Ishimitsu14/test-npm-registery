import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';
import { Email } from '@shared/common-internal';

import { User } from '../User';

export class UserByProfileEmailSpecification extends Specification<User> {
  readonly emails: Email[];

  constructor(...emails: (Email | Email[])[]) {
    super();
    this.emails = mapManyArray(emails);

    this.addFilter((user) => !!this.emails.find((email) => user.profile.email.isEquals(email)));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [...this.emails];
  }
}
