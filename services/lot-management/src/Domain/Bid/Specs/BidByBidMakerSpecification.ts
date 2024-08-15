import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { BidMakerPK } from '../../Actors';
import { Bid } from '../Bid';

export class BidByBidMakerSpecification extends Specification<Bid> {
  readonly bidMakerPKs: BidMakerPK[];

  constructor(bidMakerPK: BidMakerPK | BidMakerPK[]) {
    super();

    this.bidMakerPKs = Array.isArray(bidMakerPK) ? bidMakerPK : [bidMakerPK];

    this.addFilter((lot) => {
      return this.bidMakerPKs.some((m) => m.isEquals(lot.bidMaker));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.bidMakerPKs];
  }
}
