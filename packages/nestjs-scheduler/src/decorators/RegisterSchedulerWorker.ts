import { SetMetadata } from '@nestjs/common';

import { SCHDULER_WORKER_METADATA } from '../const';

export function RegisterSchedulerWorker(schedulerName: string): ClassDecorator & MethodDecorator {
  return SetMetadata<typeof SCHDULER_WORKER_METADATA, SCHDULER_WORKER_METADATA>(SCHDULER_WORKER_METADATA, { schedulerName });
}
