import { ModuleMetadata, Scope } from '@nestjs/common';

import { LOT_BADGE_REPOSITORY_INJECT_TOKEN } from '../../../../Application';
import { LotBadgeRepository } from './LotBadgeRepository';

export const LOT_BADGE_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: LOT_BADGE_REPOSITORY_INJECT_TOKEN,
    useClass: LotBadgeRepository,
    scope: Scope.REQUEST,
  },
];
