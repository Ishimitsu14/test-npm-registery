import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';

import { User } from '../User';
import { UserNickname } from '../UserNicknameKey';

export class UserByNicknameSpecification extends Specification<User> {
  readonly nicknames: UserNickname[];

  constructor(...nicknames: (UserNickname | UserNickname[])[]) {
    super();
    this.nicknames = mapManyArray(nicknames);

    this.addFilter((user) => !!this.nicknames.find((publicAddress) => user.nickname.isEquals(publicAddress)));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.nicknames];
  }
}
