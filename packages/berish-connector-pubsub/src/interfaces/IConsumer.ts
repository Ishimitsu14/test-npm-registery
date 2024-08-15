import { ConsumerClientInferEventsMap, ConsumerClientInferWorkerContext, ConsumerClientInferWorkerOptions, IConsumerAdapter } from './IConsumerAdapter';
import { IConsumerEventEveryTopicHandler, IConsumerEventHandler } from './IConsumerEventHandler';
import { IConsumerWorkerHandler } from './IConsumerWorkerHandler';
import { PubsubMessageTopic } from './PubsubMessage';

export interface IConsumer<TConsumerClient extends IConsumerAdapter<any, any, any>> {
  readonly namespace: string;
  readonly client: TConsumerClient;
  readonly isStarted: boolean;

  start(): Promise<void>;
  stop(): Promise<void>;

  registerWorkerHandler(topic: PubsubMessageTopic, handler: IConsumerWorkerHandler<ConsumerClientInferWorkerContext<TConsumerClient>, ConsumerClientInferWorkerOptions<TConsumerClient>>): void;
  getWorkerHandlers(): [PubsubMessageTopic, IConsumerWorkerHandler<ConsumerClientInferWorkerContext<TConsumerClient>, ConsumerClientInferWorkerOptions<TConsumerClient>>][];
  getWorkerTopicHandler(topic: PubsubMessageTopic): IConsumerWorkerHandler<ConsumerClientInferWorkerContext<TConsumerClient>, ConsumerClientInferWorkerOptions<TConsumerClient>>;
  getWorkerTopicHandlerOptions(topic: PubsubMessageTopic): ConsumerClientInferWorkerOptions<TConsumerClient>;

  registerEventHandler<EventName extends keyof ConsumerClientInferEventsMap<TConsumerClient>>(
    topic: PubsubMessageTopic,
    eventHandler: IConsumerEventHandler<ConsumerClientInferEventsMap<TConsumerClient>, EventName>,
  ): void;
  getEventHandlers(): [PubsubMessageTopic, IConsumerEventHandler<ConsumerClientInferEventsMap<TConsumerClient>, keyof ConsumerClientInferEventsMap<TConsumerClient>>[]][];
  getEventTopicHandlers(topic: PubsubMessageTopic): IConsumerEventHandler<ConsumerClientInferEventsMap<TConsumerClient>, keyof ConsumerClientInferEventsMap<TConsumerClient>>[];

  registerEventEveryTopicHandler<EventName extends keyof ConsumerClientInferEventsMap<TConsumerClient>>(
    eventHandler: IConsumerEventEveryTopicHandler<ConsumerClientInferEventsMap<TConsumerClient>, EventName>,
  ): void;
  getEventHandlersEveryTopic(): IConsumerEventEveryTopicHandler<ConsumerClientInferEventsMap<TConsumerClient>, keyof ConsumerClientInferEventsMap<TConsumerClient>>[];

  getMetadataMap(item: object): Record<string | symbol, any>;
  setMetadataMap(item: object, map: Record<string | symbol, any>): void;
}
