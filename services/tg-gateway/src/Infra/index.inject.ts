import { ModuleMetadata } from '@nestjs/common';

import { COMMON_INJECT_PROVIDERS } from './Common';
import { CONNECTORS_INJECT_PROVIDERS } from './Connectors';

export const INFRA_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...COMMON_INJECT_PROVIDERS, ...CONNECTORS_INJECT_PROVIDERS];
