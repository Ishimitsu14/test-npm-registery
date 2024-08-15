import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { OfferMakerPK } from '../../Actors';
import { Deal } from '../Deal';

export class DealByOfferMakerSpecfication extends Specification<Deal> {
  readonly offerMakerPKs: OfferMakerPK[];

  constructor(offerMakerPK: OfferMakerPK | OfferMakerPK[]) {
    super();

    this.offerMakerPKs = Array.isArray(offerMakerPK) ? offerMakerPK : [offerMakerPK];

    this.addFilter((deal) => {
      return this.offerMakerPKs.some((m) => deal.offerMakers.isExists(m));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.offerMakerPKs];
  }
}
