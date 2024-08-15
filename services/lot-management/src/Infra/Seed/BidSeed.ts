import { NullableObject } from '@ddd/core';
import { Query } from '@ddd/specifications';
import { faker } from '@faker-js/faker';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { Country } from '@shared/common-internal';
import { SeedUtils } from '@shared/db';

import { BID_REPOSITORY_INJECT_TOKEN, BidCreate, BidCreateProps, LOT_REPOSITORY_INJECT_TOKEN } from '../../Application';
import { Bid, InvestorType } from '../../Domain';
import { ActorSeed } from './ActorSeed';
import { LotSeed } from './LotSeed';

export class BidSeed {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  @Inject(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: LOT_REPOSITORY_INJECT_TOKEN;

  @Inject(LotSeed)
  private lotSeed: LotSeed;

  @Inject(ActorSeed)
  private actorSeed: ActorSeed;

  @Inject(BidCreate)
  private bidCreate: BidCreate;

  async createDemo() {
    const bidMaker = await this.actorSeed.getDemoBidMaker();
  }

  async createDemoBid() {
    const lot = await this.lotSeed.getRandomLot();
    const bidMaker = await this.actorSeed.getDemoBidMaker();

    const fullContractSize = this.seedUtils.flip();

    // const contract = ContractSize.createFromUnitQuantity(lot.contractShare, lotContractSize.unitQuantity.mul(faker.number.float({ min: 0.1, max: 0.5 })), lotContractSize.price.precision)
    const summary = '';
    const units = '';
    const price = '';
    const fdv = NullableObject.mapNull(null);
    const deadline = NullableObject.mapNull(this.seedUtils.flipCallback(() => faker.date.future().valueOf(), 20));

    return this.test({
      lot: lot.primaryKey.id,
      bidMaker: bidMaker.userId,
      summary,
      units,
      price,
      location: faker.helpers.arrayElement(Country.getAllIds()),
      isDirect: this.seedUtils.flip(60),
      bidMakerType: faker.helpers.arrayElement(InvestorType.getAllIds()),
      readyForVerification: this.seedUtils.flip(70),
      telegram: faker.internet.userName(),
      deadline,
      fdv,
    });
  }

  async test(props: BidCreateProps) {
    return this.seedUtils.newRequest('bid.create', async () => {
      await this.bidCreate.validate(props);
      return this.bidCreate.execute(props);
    });
  }

  async getRandomBid(): Promise<Bid> {
    const bidRepository = await this.bidRepository();

    const total = await bidRepository.count();

    const randomSkip = faker.number.int({ min: 0, max: total - 1 });
    const bids = await bidRepository.find(Query.create(Bid).addPageable(randomSkip, 1));

    return bids.items[0];
  }

  // async createActiveBid() {
  //   const bid = await this.createBid();
  //   if (bid.status === 'ACTIVE') {
  //     return bid;
  //   }
  //   bid.makeActive(ModeratorPK.create('super-moderator'), this.lotRepository);
  //   this.bidRepository.update(bid);
  //   return bid;
  // }
}
