import { IConsumerEventEveryTopicHandler, IConsumerEventHandler } from './IConsumerEventHandler';
import { IConsumerWorkerHandler } from './IConsumerWorkerHandler';
import { PubsubMessageTopic } from './PubsubMessage';

export interface IConsumerAdapter<TWorkerContext extends Record<string, any>, TWorkerOptions extends Record<string, any>, EventsMap extends Record<string, (...args: any[]) => any>> {
  start(): Promise<void>;
  stop(): Promise<void>;
  readonly isStarted: boolean;

  bind(): Promise<void>;
  bindWorkerHandlers(): Promise<void>;
  bindEventHandlers(): Promise<void>;

  registerWorkerHandler(namespace: string, topic: PubsubMessageTopic, handler: IConsumerWorkerHandler<TWorkerContext, TWorkerOptions>): void;
  getWorkerHandlers(): Map<string, [PubsubMessageTopic, IConsumerWorkerHandler<TWorkerContext, TWorkerOptions>][]>;
  getWorkerNamespaceHandlers(namespace: string): [PubsubMessageTopic, IConsumerWorkerHandler<TWorkerContext, TWorkerOptions>][];
  getWorkerNamespaceTopicHandler(namespace: string, topic: PubsubMessageTopic): IConsumerWorkerHandler<TWorkerContext, TWorkerOptions>;
  getWorkerNamespaceTopicHandlerOptions(namespace: string, topic: PubsubMessageTopic): TWorkerOptions;

  registerEventHandler<EventName extends keyof EventsMap>(namespace: string, topic: PubsubMessageTopic, eventHandler: IConsumerEventHandler<EventsMap, EventName>): void;
  getEventHandlers(): Map<string, [PubsubMessageTopic, IConsumerEventHandler<EventsMap, keyof EventsMap>[]][]>;
  getEventNamespaceHandlers(namespace: string): [PubsubMessageTopic, IConsumerEventHandler<EventsMap, keyof EventsMap>[]][];
  getEventNamespaceTopicHandlers(namespace: string, topic: PubsubMessageTopic): IConsumerEventHandler<EventsMap, keyof EventsMap>[];

  registerEventHandlerEveryTopic<EventName extends keyof EventsMap>(namespace: string, eventHandler: IConsumerEventEveryTopicHandler<EventsMap, EventName>): void;
  getEventEveryTopicHandlers(): Map<string, IConsumerEventEveryTopicHandler<EventsMap, keyof EventsMap>[]>;
  getEventNamespaceEveryTopicHandlers(namespace: string): IConsumerEventEveryTopicHandler<EventsMap, keyof EventsMap>[];
}

export type ConsumerClientInferWorkerContext<T> = T extends IConsumerAdapter<infer WorkerContext, any, any> ? WorkerContext : never;
export type ConsumerClientInferWorkerOptions<T> = T extends IConsumerAdapter<any, infer WorkerOptions, any> ? WorkerOptions : never;
export type ConsumerClientInferEventsMap<T> = T extends IConsumerAdapter<any, any, infer EventsMap> ? EventsMap : never;
