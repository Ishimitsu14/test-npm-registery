import { ModuleMetadata } from '@nestjs/common';

import { NestSchedulerExplorer } from '../explorers';
import { injectSchedulerManager, InjectSchedulerManagerParams } from './injectSchedulerManager';

export interface SchedulerInjectParams {
  scheduler: InjectSchedulerManagerParams;
}

export function injectSchedulerPlugin(params: SchedulerInjectParams): ModuleMetadata['providers'] {
  return [...injectSchedulerManager(params.scheduler), NestSchedulerExplorer];
}
