import { ModuleMetadata } from '@nestjs/common';

import { SERVICES_INJECT_PROVIDERS } from './Services';

export const APPLICATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...SERVICES_INJECT_PROVIDERS];
