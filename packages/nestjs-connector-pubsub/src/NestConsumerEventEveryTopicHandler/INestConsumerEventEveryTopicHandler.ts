import { PubsubMessageTopic } from '@packages/berish-connector-pubsub';

export interface INestConsumerEventEveryTopicHandler<
  EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  EventName extends keyof EventMap = keyof EventMap,
> {
  execute(topic: PubsubMessageTopic, ...args: Parameters<EventMap[EventName]>): ReturnType<EventMap[EventName]>;
}

export interface INestConsumerEventEveryTopicHandlerMethod<
  EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  EventName extends keyof EventMap = keyof EventMap,
> {
  (topic: PubsubMessageTopic, ...args: Parameters<EventMap[EventName]>): ReturnType<EventMap[EventName]>;
}

export type INestConsumerEventEveryTopicHandlerMethodParameters<
  EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  EventName extends keyof EventMap = keyof EventMap,
> = Parameters<INestConsumerEventEveryTopicHandlerMethod<EventMap, EventName>>;
