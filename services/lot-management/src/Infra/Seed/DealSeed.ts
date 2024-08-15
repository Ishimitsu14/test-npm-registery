import { Query } from '@ddd/specifications';
import { faker } from '@faker-js/faker';
import { Inject } from '@nestjs/common';

import { BID_REPOSITORY_INJECT_TOKEN, DEAL_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../../Application';
import { Deal } from '../../Domain';
import { BidSeed } from './BidSeed';
import { LotSeed } from './LotSeed';

export class DealSeed {
  @Inject(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: DEAL_REPOSITORY_INJECT_TOKEN;

  @Inject(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: BID_REPOSITORY_INJECT_TOKEN;

  @Inject(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: LOT_REPOSITORY_INJECT_TOKEN;

  @Inject(LotSeed)
  private lotSeed: LotSeed;

  @Inject(BidSeed)
  private bidSeed: BidSeed;

  // async createDeal(): Promise<Deal> {
  //   const bid = await this.bidSeed.createActiveBid();
  //   const lot = await this.lotSeed.getLotByBid(bid);

  //   const deal = await bid.accept(lot.offerMaker, this.lotRepository, this.dealRepository);

  //   this.bidRepository.update(bid);

  //   return deal;
  // }

  async getRandomDeal(): Promise<Deal> {
    const total = await this.dealRepository.count();

    const randomSkip = faker.number.int({ min: 0, max: total - 1 });
    const lots = await this.dealRepository.find(Query.create().addPageable(randomSkip, 1));

    return lots.items[0];
  }
}
