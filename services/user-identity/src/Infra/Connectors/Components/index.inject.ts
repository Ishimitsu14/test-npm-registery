import { ModuleMetadata } from '@nestjs/common';

import { SCHEDULER_INJECT_PROVIDERS } from './scheduler.bull';

export const COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...SCHEDULER_INJECT_PROVIDERS];
