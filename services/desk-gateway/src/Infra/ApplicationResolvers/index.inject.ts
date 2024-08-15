import { ModuleMetadata } from '@nestjs/common';

import { JWT_HELPER_INJECT_TOKEN } from '../../Application';
import { JwtHelper } from './JwtHelper';

export const APPLICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: JWT_HELPER_INJECT_TOKEN,
    useClass: JwtHelper,
  },
];
