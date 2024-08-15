import { ModuleMetadata } from '@nestjs/common';

import { COMMON_INJECT_PROVIDERS } from './Common';
import { CONNECTORS_INJECT_PROVIDERS } from './Connectors';
import { DATABASE_INJECT } from './Database';
import { DOMAIN_RESOLVERS_INJECT_PROVIDERS } from './DomainResolvers';
import { UNIT_OF_WORK_INJECT_PROVIDERS } from './UnitOfWork';

export const INFRA_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...COMMON_INJECT_PROVIDERS,
  ...CONNECTORS_INJECT_PROVIDERS,
  ...DATABASE_INJECT,
  ...DOMAIN_RESOLVERS_INJECT_PROVIDERS,
  ...UNIT_OF_WORK_INJECT_PROVIDERS,
];
