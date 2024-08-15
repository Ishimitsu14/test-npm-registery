import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { SeedUtils } from '@shared/db';

import { ActorSeed } from './ActorSeed';
import { AssetSeed } from './AssetSeed';
import { BidSeed } from './BidSeed';
import { DealSeed } from './DealSeed';
import { LotBadgeSeed } from './LotBadgeSeed';
import { LotSeed } from './LotSeed';

export class SEED implements OnApplicationBootstrap {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @Inject(ActorSeed)
  private actorSeed: ActorSeed;

  @Inject(AssetSeed)
  private assetSeed: AssetSeed;

  @Inject(LotSeed)
  private lotSeed: LotSeed;

  @Inject(LotBadgeSeed)
  private lotBadgeSeed: LotBadgeSeed;

  @InjectContext(BidSeed)
  private readonly bidSeed: InjectContext<BidSeed>;

  @InjectContext(DealSeed)
  private readonly dealSeed: InjectContext<DealSeed>;

  async onApplicationBootstrap() {
    await this.seedUtils.bootstrap(() => this.seed());
  }

  private async seed() {
    // const actorSeed = await this.actorSeed();
    // const lotSeed = await this.lotSeed();
    // const bidSeed = await this.bidSeed();
    // const dealSeed = await this.dealSeed();

    await this.lotBadgeSeed.createDemo();
    await this.assetSeed.createDemo();
    await this.lotSeed.createDemo();

    // await lotSeed.createDemo();
    // await uow.commit();

    // await Promise.all(faker.helpers.multiple(() => bidSeed.createBid(), { count: { min: 10, max: 50 } }));
    // await uow.commit();

    // await Promise.all(faker.helpers.multiple(() => dealSeed.createDeal(), { count: { min: 10, max: 50 } }));
    // await uow.commit();

    // await Promise.all(faker.helpers.multiple(() => assetSeed.createAsset(), { count: { min: 10, max: 100 } }));

    // // await lotSeed.createTest();

    // await Promise.all(
    //   faker.helpers.multiple(
    //     async () => {
    //       const type = faker.helpers.arrayElement([...LotStatus]);
    //       if (type === 'DRAFT') {
    //         await lotSeed.createLotNewDraft();
    //       } else if (type === 'ON_MODERATION') {
    //         await lotSeed.createLotNewModeration();
    //       } else if (type === 'ACTIVE') {
    //         await lotSeed.createLotActive();
    //       } else if (type === 'ARCHIVED') {
    //         await lotSeed.createArchivedLot();
    //       } else if (type === 'REJECTED') {
    //         await lotSeed.createRejectedLot();
    //       } else if (type === 'COMPLETED') {
    //         await lotSeed.createCompleteLot();
    //       }
    //     },
    //     { count: { min: 100, max: 200 } },
    //   ),
    // );
    // await uow.commit();

    // await Promise.all(faker.helpers.multiple(() => , { count: { min: 50, max: 100 } }));
    // await uow.commit();

    // await Promise.all(faker.helpers.multiple(() => , { count: { min: 500, max: 1000 } }));
    // await uow.commit();
  }
}
