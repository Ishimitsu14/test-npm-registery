import { SetMetadata } from '@nestjs/common';
import { SchedulerRegisterGroupParams, SchedulerRegisterParams } from '@packages/berish-scheduler';

import { SCHEDULER_METADATA } from '../const';

export function RegisterScheduler(schdulerName: string, options: SchedulerRegisterParams<any> | SchedulerRegisterGroupParams<any>[]): ClassDecorator & MethodDecorator {
  return SetMetadata<typeof SCHEDULER_METADATA, SCHEDULER_METADATA>(SCHEDULER_METADATA, { schedulerName: schdulerName, options });
}
