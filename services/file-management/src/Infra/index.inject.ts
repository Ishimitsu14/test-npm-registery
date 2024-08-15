import { ModuleMetadata } from '@nestjs/common';

import { COMMON_INJECT_PROVIDERS } from './Common';
import { DATABASE_INJECT } from './Database';
import { DOMAIN_RESOLVERS_INJECT_PROVIDERS } from './DomainResolvers';
import { S3_INJECT_PROVIDERS } from './S3';
import { SEED_INJECT_PROVIDERS } from './Seed';
import { UNIT_OF_WORK_INJECT_PROVIDERS } from './UnitOfWork';

export const INFRA_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...COMMON_INJECT_PROVIDERS,
  ...S3_INJECT_PROVIDERS,
  ...DATABASE_INJECT,
  ...DOMAIN_RESOLVERS_INJECT_PROVIDERS,
  ...SEED_INJECT_PROVIDERS,
  ...UNIT_OF_WORK_INJECT_PROVIDERS,
];
