import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';
import { Telegram } from '@shared/common-internal';

import { User } from '../User';

export class UserByProfileTelegramSpecification extends Specification<User> {
  readonly accounts: Telegram[];

  constructor(...accounts: (Telegram | Telegram[])[]) {
    super();
    this.accounts = mapManyArray(accounts);

    this.addFilter((user) => !!this.accounts.find((telegramAccount) => user.profile.telegram.isEquals(telegramAccount)));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [...this.accounts];
  }
}
