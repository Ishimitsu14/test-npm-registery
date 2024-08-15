import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { UserPK } from '../../Actors';
import { FavoriteLot } from '../FavoriteLot';

export class FavoriteLotByUserSpecfication extends Specification<FavoriteLot> {
  readonly userPKs: UserPK[];

  constructor(userPK: UserPK | UserPK[]) {
    super();

    this.userPKs = Array.isArray(userPK) ? userPK : [userPK];

    this.addFilter((favoriteLot) => {
      return this.userPKs.some((m) => favoriteLot.userPK.isEquals(m));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.userPKs];
  }
}
