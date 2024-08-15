import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

import { BidPK } from '../Bid';

export class DealPK extends EntityKey {
  static fromBidPK(pk: BidPK) {
    return new DealPK(pk.id);
  }

  static raw(id: number) {
    return new DealPK(id);
  }

  static fromSnapshot(id: number) {
    return new DealPK(id);
  }

  private constructor(readonly id: number) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.id];
  }
}
