import { InjectionToken, Type } from '@nestjs/common';
import { IConsumer } from '@packages/berish-connector-pubsub';

export interface NestConsumerEventHandlerMetadata {
  injectionToken: InjectionToken | Type<IConsumer<any>>;
  topic: string | true;
  eventName: string;
}
