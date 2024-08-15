import { ModuleMetadata } from '@nestjs/common';

import { RESOURCE_MAPPER_INJECT_PROVIDERS } from './ResourceMapper';
import { SERVICES_INJECT_PROVIDERS } from './Services';

export const APPLICATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...RESOURCE_MAPPER_INJECT_PROVIDERS, ...SERVICES_INJECT_PROVIDERS];
