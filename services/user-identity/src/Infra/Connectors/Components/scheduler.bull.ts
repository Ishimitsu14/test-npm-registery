import { ModuleMetadata } from '@nestjs/common';
import { SchedulerManager, useSchedulerNext } from '@packages/berish-scheduler';
import { CronSchedulerAdapter } from '@packages/berish-scheduler-cron-adapter';
import { NestContextManager } from '@packages/nestjs-request-context';
import { injectSchedulerPlugin } from '@packages/nestjs-scheduler';
import { UserIdentityConfig } from '@shared/config';

import { SCHEDULER_MANAGER_INJECT_TOKEN, SCHEDULER_REDIS_INJECT_TOKEN } from '../../../Application';

export const SCHEDULER_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: SCHEDULER_MANAGER_INJECT_TOKEN,
    useFactory: (schedulerRedis: SCHEDULER_REDIS_INJECT_TOKEN, nestContextManager: NestContextManager) => {
      // const schedulerAdapter = new BullSchedulerAdapter({ connection: schedulerRedis });
      const schedulerAdapter = new CronSchedulerAdapter();

      const scheduler = new SchedulerManager({
        adapter: schedulerAdapter,
        namespace: UserIdentityConfig.namespace,
        middlewares: [
          () => {
            return nestContextManager.runInContext(useSchedulerNext());
          },
        ],
      });

      return scheduler;
    },
    inject: [SCHEDULER_REDIS_INJECT_TOKEN, NestContextManager],
  },
  ...injectSchedulerPlugin({ scheduler: { useExisting: SCHEDULER_MANAGER_INJECT_TOKEN } }),
];
