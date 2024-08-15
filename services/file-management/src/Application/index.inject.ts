import { ModuleMetadata } from '@nestjs/common';

import { CQRS_INJECT_PROVIDERS } from './CQRS';
import { HELPERS_INJECT_PROVIDERS } from './Helpers';
import { RESOURCE_MAPPERS_INJECT_PROVIDERS } from './ResourceMappers';

export const APPLICATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...CQRS_INJECT_PROVIDERS, ...HELPERS_INJECT_PROVIDERS, ...RESOURCE_MAPPERS_INJECT_PROVIDERS];
