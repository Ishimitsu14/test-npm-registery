import { ModuleMetadata } from '@nestjs/common';
import { FileManagementConfig } from '@shared/config';
import { seedInject } from '@shared/db';

import { FileEntitySeed } from './FileEntitySeed';
import { SEED } from './SEED';

export const SEED_INJECT_PROVIDERS: ModuleMetadata['providers'] = FileManagementConfig.dev.useSeed ? [...seedInject(), { provide: FileEntitySeed, useClass: FileEntitySeed }, SEED] : [];
