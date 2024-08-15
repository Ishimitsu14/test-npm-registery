import { InjectionToken } from '@nestjs/common';

import { NestConsumerWorkerHandler } from '../NestConsumerWorkerHandler';

export function NestConsumerWorkerEveryTopicHandler<WorkerOptions extends Record<string, any>>(injectionToken: InjectionToken, workerOptions: WorkerOptions) {
  return NestConsumerWorkerHandler(injectionToken, '*', workerOptions);
}

export function NestConsumerWorkerEveryTopicHandlerFactory<WorkerOptions extends Record<string, any> = Record<string, any>>(injectionToken: InjectionToken) {
  return function (workerOptions: WorkerOptions) {
    return NestConsumerWorkerEveryTopicHandler<WorkerOptions>(injectionToken, workerOptions);
  };
}
