import { ModuleMetadata } from '@nestjs/common';

import { APPLICATION_RESOLVERS_INJECT_PROVIDERS } from './ApplicationResolvers';
import { CONNECTORS_INJECT_PROVIDERS } from './Connectors';

export const INFRA_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...APPLICATION_RESOLVERS_INJECT_PROVIDERS, ...CONNECTORS_INJECT_PROVIDERS];
