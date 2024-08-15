import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { BidMakerPK } from '../../Actors';
import { Deal } from '../Deal';

export class DealByBidMakerSpecfication extends Specification<Deal> {
  readonly bidMakerPKs: BidMakerPK[];

  constructor(bidMakerPK: BidMakerPK | BidMakerPK[]) {
    super();

    this.bidMakerPKs = Array.isArray(bidMakerPK) ? bidMakerPK : [bidMakerPK];

    this.addFilter((deal) => {
      return this.bidMakerPKs.some((m) => deal.bidMakers.isExists(m));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.bidMakerPKs];
  }
}
