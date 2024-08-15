import { ModuleMetadata } from '@nestjs/common';

import { REDIS_BULL_INJECT_PROVIDERS } from './redis-bull.inject';

export const ARTIFACTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...REDIS_BULL_INJECT_PROVIDERS];
