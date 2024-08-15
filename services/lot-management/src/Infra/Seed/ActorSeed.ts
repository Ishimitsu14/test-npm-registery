import { ListCollection } from '@ddd/core';
import { faker } from '@faker-js/faker';

import { BidMakerPK, InvestorType, OfferMakerPK } from '../../Domain';

export class ActorSeed {
  async getRandomOfferMaker(): Promise<OfferMakerPK> {
    return OfferMakerPK.create(faker.internet.userName());
  }

  async getDemoOfferMaker(): Promise<OfferMakerPK> {
    return OfferMakerPK.create('0000-ms-capital');
  }

  async getDemoBidMaker(): Promise<BidMakerPK> {
    return BidMakerPK.create('0000-observer');
  }

  get getDemoOfferMakerTypes(): ListCollection<InvestorType> {
    return new ListCollection([InvestorType.VENTURE_FUND]);
  }
}
