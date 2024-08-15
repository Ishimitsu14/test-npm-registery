import { CustomDecorator, InjectionToken, SetMetadata } from '@nestjs/common';

import { CONSUMER_EVENT_HANDLER_METADATA } from '../const';
import { NestConsumerEventHandlerMetadata } from './NestConsumerEventHandlerMetadata';

export function NestConsumerEventHandler<Topic extends string = string, EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>>(
  injectionToken: InjectionToken,
  topic: Topic,
  eventName: keyof EventMap & string,
): CustomDecorator<typeof CONSUMER_EVENT_HANDLER_METADATA> {
  const metadata: NestConsumerEventHandlerMetadata = {
    injectionToken,
    topic: topic === '*' ? true : topic,
    eventName,
  };
  return SetMetadata(CONSUMER_EVENT_HANDLER_METADATA, metadata);
}

export function NestConsumerEventHandlerFactory<Topic extends string = string, EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>>(
  injectionToken: InjectionToken,
) {
  return function (topic: Topic, eventName: keyof EventMap & string) {
    return NestConsumerEventHandler<Topic, EventMap>(injectionToken, topic, eventName);
  };
}
