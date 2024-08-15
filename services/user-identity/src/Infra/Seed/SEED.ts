import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { SeedUtils } from '@shared/db';

import { UNIT_OF_WORK_INJECT_TOKEN } from '../../Application';
import { UserSeed } from './UserSeed';

export class SEED implements OnApplicationBootstrap {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @Inject(UserSeed)
  private readonly userSeed: UserSeed;

  async onApplicationBootstrap() {
    await this.seedUtils.bootstrap(() => this.seed());
  }

  private async seed() {
    await this.userSeed.createDemo();
  }
}
