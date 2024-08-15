import { SchedulerManager } from '@packages/berish-scheduler';
import IORedis from 'ioredis';

export const SCHEDULER_REDIS_INJECT_TOKEN = Symbol('SCHEDULER_REDIS_INJECT_TOKEN');
export type SCHEDULER_REDIS_INJECT_TOKEN = IORedis;

export const SCHEDULER_MANAGER_INJECT_TOKEN = Symbol('SCHEDULER_MANAGER_INJECT_TOKEN');
export type SCHEDULER_MANAGER_INJECT_TOKEN = SchedulerManager;
