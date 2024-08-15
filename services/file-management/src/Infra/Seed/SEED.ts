import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { SeedUtils } from '@shared/db';

import { FileEntitySeed } from './FileEntitySeed';

export class SEED implements OnApplicationBootstrap {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @Inject(FileEntitySeed)
  private readonly fileEntitySeed: FileEntitySeed;

  async onApplicationBootstrap() {
    await this.seedUtils.bootstrap(() => this.seed());
  }

  private async seed() {
    await this.fileEntitySeed.createDemo();
  }
}
