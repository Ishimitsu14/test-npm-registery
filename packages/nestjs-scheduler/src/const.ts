import { SchedulerManager, SchedulerRegisterGroupParams, SchedulerRegisterParams } from '@packages/berish-scheduler';

export const SCHEDULER_METADATA = Symbol('SCHEDULER_METADATA');
export type SCHEDULER_METADATA = {
  schedulerName: string;
  options: SchedulerRegisterParams<any> | SchedulerRegisterGroupParams<any>[];
};

export const SCHDULER_WORKER_METADATA = Symbol('SCHDULER_WORKER_METADATA');
export type SCHDULER_WORKER_METADATA = { schedulerName: string };

export const SCHEDULER_INJECT_TOKEN = Symbol('SCHEDULER_INJECT_TOKEN');
export type SCHEDULER_INJECT_TOKEN = SchedulerManager;
