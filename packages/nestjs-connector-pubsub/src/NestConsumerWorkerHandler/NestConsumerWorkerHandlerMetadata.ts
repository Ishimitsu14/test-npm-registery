import { InjectionToken, Type } from '@nestjs/common';
import { IConsumer } from '@packages/berish-connector-pubsub';

export interface NestConsumerWorkerHandlerMetadata {
  injectionToken: InjectionToken | Type<IConsumer<any>>;
  topic: string;
  workerOptions: Record<string, any>;
}
