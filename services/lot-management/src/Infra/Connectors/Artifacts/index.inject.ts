import { ModuleMetadata } from '@nestjs/common';

import { NATS_INJECT_PROVIDERS } from './nats.inject';

export const ARTIFACTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...NATS_INJECT_PROVIDERS];
