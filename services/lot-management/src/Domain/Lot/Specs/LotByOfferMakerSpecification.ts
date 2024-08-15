import { ValueObjectAtomicValue } from '@ddd/domain';
import { Specification } from '@ddd/specifications';

import { OfferMakerPK } from '../../Actors';
import { Lot } from '../Lot';

export class LotByOfferMakerSpecification extends Specification<Lot> {
  readonly offerMakerPKs: OfferMakerPK[];

  constructor(offerMakerPK: OfferMakerPK | OfferMakerPK[]) {
    super();

    this.offerMakerPKs = Array.isArray(offerMakerPK) ? offerMakerPK : [offerMakerPK];

    this.addFilter((lot) => {
      return this.offerMakerPKs.some((m) => m.isEquals(lot.offerMaker));
    });
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.offerMakerPKs];
  }
}
