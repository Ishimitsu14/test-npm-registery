import { BullSchedulerAdapter } from '@packages/berish-scheduler-bull-adapter';
import { Redis } from 'ioredis';

export interface CreateSchedulerAdapterOptions {
  connection: Redis;
}

export function createSchedulerAdapter({ connection }: CreateSchedulerAdapterOptions) {
  return new BullSchedulerAdapter({
    connection,
  });
}
