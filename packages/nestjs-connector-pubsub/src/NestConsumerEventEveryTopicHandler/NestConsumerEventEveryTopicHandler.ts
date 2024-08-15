import { CustomDecorator, InjectionToken } from '@nestjs/common';

import { CONSUMER_EVENT_HANDLER_METADATA } from '../const';
import { NestConsumerEventHandler } from '../NestConsumerEventHandler';

export function NestConsumerEventEveryTopicHandler<EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>>(
  injectionToken: InjectionToken,
  eventName: keyof EventMap & string,
): CustomDecorator<typeof CONSUMER_EVENT_HANDLER_METADATA> {
  return NestConsumerEventHandler(injectionToken, '*', eventName);
}

export function NestConsumerEventEveryTopicHandlerFactory<EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>>(injectionToken: InjectionToken) {
  return function (eventName: keyof EventMap & string) {
    return NestConsumerEventEveryTopicHandler<EventMap>(injectionToken, eventName);
  };
}
