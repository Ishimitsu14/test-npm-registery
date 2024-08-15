import { ModuleMetadata } from '@nestjs/common';

import { CQRS_INJECT_PROVIDERS } from './CQRS';
import { DOMAIN_EVENT_TRIGGERS } from './DomainEventTriggers';
import { RESOURCE_MAPPERS_INJECT_PROVIDERS } from './ResourceMappers';

export const APPLICATION_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...CQRS_INJECT_PROVIDERS, ...RESOURCE_MAPPERS_INJECT_PROVIDERS, ...DOMAIN_EVENT_TRIGGERS];
