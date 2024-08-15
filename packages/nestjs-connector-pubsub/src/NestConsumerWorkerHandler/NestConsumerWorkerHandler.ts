import { CustomDecorator, InjectionToken, SetMetadata } from '@nestjs/common';
import { PubsubMessageSchemaMap, PubsubMessageSchemaPath } from '@packages/berish-connector-pubsub';

import { CONSUMER_WORKER_HANDLER_METADATA } from '../const';
import { NestConsumerWorkerHandlerMetadata } from './NestConsumerWorkerHandlerMetadata';

export function NestConsumerWorkerHandler<Topic extends string = string, WorkerOptions extends Record<string, any> = Record<string, any>>(
  injectionToken: InjectionToken,
  topic: Topic,
  workerOptions: WorkerOptions,
): CustomDecorator<typeof CONSUMER_WORKER_HANDLER_METADATA> {
  const metadata: NestConsumerWorkerHandlerMetadata = {
    injectionToken,
    topic,
    workerOptions,
  };
  return SetMetadata(CONSUMER_WORKER_HANDLER_METADATA, metadata);
}

export function NestConsumerWorkerHandlerFactory<TSchemaMap extends PubsubMessageSchemaMap<any>, WorkerOptions extends Record<string, any> = Record<string, any>>(injectionToken: InjectionToken) {
  return function (topic: PubsubMessageSchemaPath<TSchemaMap>, workerOptions: WorkerOptions) {
    return NestConsumerWorkerHandler<PubsubMessageSchemaPath<TSchemaMap>, WorkerOptions>(injectionToken, topic, workerOptions);
  };
}
