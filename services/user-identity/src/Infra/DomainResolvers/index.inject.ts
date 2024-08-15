import { ModuleMetadata } from '@nestjs/common';

import { EVM_AUTH_HELPER_INJECT_TOKEN, HASH_STRING_HELPER_INJECT_TOKEN, SUMSUB_AUTH_HELPER_INJECT_TOKEN } from '../../Application';
import { EvmAuthHelper } from './EvmAuthHelper';
import { HashStringHelper } from './HashStringHelper';
import { SumsubAuthHelper } from './SumsubAuthHelper';

export const DOMAIN_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: EVM_AUTH_HELPER_INJECT_TOKEN,
    useClass: EvmAuthHelper,
  },
  {
    provide: HASH_STRING_HELPER_INJECT_TOKEN,
    useClass: HashStringHelper,
  },
  {
    provide: SUMSUB_AUTH_HELPER_INJECT_TOKEN,
    useClass: SumsubAuthHelper,
  },
];
