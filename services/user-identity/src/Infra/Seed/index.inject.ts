import { ModuleMetadata } from '@nestjs/common';
import { UserIdentityConfig } from '@shared/config';
import { seedInject } from '@shared/db';

import { SEED } from './SEED';
import { UserSeed } from './UserSeed';

export const SEED_INJECT_PROVIDERS: ModuleMetadata['providers'] = UserIdentityConfig.dev.useSeed ? [...seedInject(), { provide: UserSeed, useClass: UserSeed }, SEED] : [];
