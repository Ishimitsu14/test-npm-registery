import { PubsubMessageTopic } from './PubsubMessage';

export interface IConsumerEventHandler<EventsMap extends Record<string, (...args: any[]) => any>, EventName extends keyof EventsMap> {
  callback: (...args: Parameters<EventsMap[EventName]>) => ReturnType<EventsMap[EventName]>;
  eventName: EventName;
}

export interface IConsumerEventEveryTopicHandler<EventsMap extends Record<string, (...args: any[]) => any>, EventName extends keyof EventsMap> {
  callback: (topic: PubsubMessageTopic, ...args: Parameters<EventsMap[EventName]>) => ReturnType<EventsMap[EventName]>;
  eventName: EventName;
}
