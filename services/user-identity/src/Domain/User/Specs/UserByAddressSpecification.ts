import { ValueObjectAtomicValue } from '@ddd/domain';
import { mapManyArray, Specification } from '@ddd/specifications';
import { EvmPublicAddress } from '@shared/common-internal';

import { User } from '../User';

export class UserByAddressSpecification extends Specification<User> {
  readonly addresses: EvmPublicAddress[];

  constructor(...addresses: (EvmPublicAddress | EvmPublicAddress[])[]) {
    super();
    this.addresses = mapManyArray(addresses);

    this.addFilter((user) => !!this.addresses.find((publicAddress) => user.authData.address.isEquals(publicAddress)));
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.addresses];
  }
}
