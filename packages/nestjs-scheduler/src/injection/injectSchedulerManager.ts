import { InjectionToken, Provider } from '@nestjs/common';
import { SchedulerManager } from '@packages/berish-scheduler';

import { SCHEDULER_INJECT_TOKEN } from '../const';

export type InjectSchedulerManagerParams =
  | SchedulerManager
  | {
      useFactory?: (...args: any[]) => SchedulerManager | Promise<SchedulerManager>;
      useExisting?: InjectionToken;
      useValue?: SchedulerManager;
      inject?: InjectionToken[];
    };

export function injectSchedulerManager(params: InjectSchedulerManagerParams): Provider<SchedulerManager>[] {
  if (params instanceof SchedulerManager) {
    return [
      {
        provide: SCHEDULER_INJECT_TOKEN,
        useValue: params,
      },
    ];
  }
  const existingProvider: Provider = params.useExisting && { provide: SCHEDULER_INJECT_TOKEN, useExisting: params.useExisting };
  const factoryProvider: Provider = params.useFactory && { provide: SCHEDULER_INJECT_TOKEN, useFactory: params.useFactory, inject: params.inject };
  const valueProvider: Provider = params.useValue && { provide: SCHEDULER_INJECT_TOKEN, useValue: params.useValue };

  return [existingProvider, factoryProvider, valueProvider].filter(Boolean);
}
