import { ModuleMetadata, Scope } from '@nestjs/common';
import { LotManagementConfig } from '@shared/config';
import { seedInject } from '@shared/db';

import { ActorSeed } from './ActorSeed';
import { AssetSeed } from './AssetSeed';
import { BidSeed } from './BidSeed';
import { DealSeed } from './DealSeed';
import { LotBadgeSeed } from './LotBadgeSeed';
import { LotSeed } from './LotSeed';
import { SEED } from './SEED';

export const SEED_INJECT_PROVIDERS: ModuleMetadata['providers'] = LotManagementConfig.dev.useSeed
  ? [
      ...seedInject(),
      { provide: BidSeed, useClass: BidSeed, scope: Scope.REQUEST },
      { provide: DealSeed, useClass: DealSeed, scope: Scope.REQUEST },
      { provide: ActorSeed, useClass: ActorSeed },
      { provide: AssetSeed, useClass: AssetSeed },
      { provide: LotSeed, useClass: LotSeed },
      { provide: LotBadgeSeed, useClass: LotBadgeSeed },
      SEED,
    ]
  : [];
