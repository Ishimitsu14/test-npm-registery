import { ModuleMetadata } from '@nestjs/common';

import { SCHEDULER_REDIS_INJECT_TOKEN } from '../../../Application';

export const REDIS_BULL_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: SCHEDULER_REDIS_INJECT_TOKEN,
    useValue: null,
    // useFactory: () => {
    //   return new IORedis({
    //     host: UserIdentityConfig.connectors.bull.host,
    //     port: UserIdentityConfig.connectors.bull.port,
    //     db: UserIdentityConfig.connectors.bull.db,
    //     username: UserIdentityConfig.connectors.bull.user,
    //     password: UserIdentityConfig.connectors.bull.password,

    //     tls: UserIdentityConfig.connectors.bull.useTLS ? {} : undefined,
    //     maxRetriesPerRequest: null,
    //   });
    // },
  },
];
