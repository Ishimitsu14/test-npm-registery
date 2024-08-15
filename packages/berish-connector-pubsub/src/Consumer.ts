import {
  ConsumerClientInferEventsMap,
  ConsumerClientInferWorkerContext,
  ConsumerClientInferWorkerOptions,
  IConsumer,
  IConsumerAdapter,
  IConsumerEventEveryTopicHandler,
  IConsumerEventHandler,
  IConsumerWorkerHandler,
  PubsubMessageTopic,
} from './interfaces';

export class Consumer<TConsumerClient extends IConsumerAdapter<any, any, any>> implements IConsumer<TConsumerClient> {
  private _metadataWeakMap: WeakMap<object, Record<string | symbol, any>> = new WeakMap();

  constructor(
    public readonly namespace: string,
    public readonly client: TConsumerClient,
  ) {}

  start(): Promise<void> {
    return this.client.start();
  }

  stop(): Promise<void> {
    return this.client.stop();
  }

  get isStarted() {
    return this.client.isStarted;
  }

  registerWorkerHandler(topic: PubsubMessageTopic, handler: IConsumerWorkerHandler<ConsumerClientInferWorkerContext<TConsumerClient>, ConsumerClientInferWorkerOptions<TConsumerClient>>): void {
    return this.client.registerWorkerHandler(this.namespace, topic, handler);
  }

  getWorkerHandlers(): [PubsubMessageTopic, IConsumerWorkerHandler<ConsumerClientInferWorkerContext<TConsumerClient>, ConsumerClientInferWorkerOptions<TConsumerClient>>][] {
    return this.client.getWorkerNamespaceHandlers(this.namespace);
  }

  getWorkerTopicHandler(topic: PubsubMessageTopic): IConsumerWorkerHandler<ConsumerClientInferWorkerContext<TConsumerClient>, ConsumerClientInferWorkerOptions<TConsumerClient>> {
    return this.client.getWorkerNamespaceTopicHandler(this.namespace, topic);
  }

  getWorkerTopicHandlerOptions(topic: PubsubMessageTopic): ConsumerClientInferWorkerOptions<TConsumerClient> {
    return this.client.getWorkerNamespaceTopicHandlerOptions(this.namespace, topic);
  }

  registerEventHandler<EventName extends keyof ConsumerClientInferEventsMap<TConsumerClient>>(
    topic: PubsubMessageTopic,
    eventHandler: IConsumerEventHandler<ConsumerClientInferEventsMap<TConsumerClient>, EventName>,
  ): void {
    return this.client.registerEventHandler(this.namespace, topic, eventHandler);
  }

  getEventHandlers(): [PubsubMessageTopic, IConsumerEventHandler<ConsumerClientInferEventsMap<TConsumerClient>, keyof ConsumerClientInferEventsMap<TConsumerClient>>[]][] {
    return this.client.getEventNamespaceHandlers(this.namespace);
  }

  getEventTopicHandlers(topic: PubsubMessageTopic): IConsumerEventHandler<ConsumerClientInferEventsMap<TConsumerClient>, keyof ConsumerClientInferEventsMap<TConsumerClient>>[] {
    return this.client.getEventNamespaceTopicHandlers(this.namespace, topic);
  }

  registerEventEveryTopicHandler<EventName extends keyof ConsumerClientInferEventsMap<TConsumerClient>>(
    eventHandler: IConsumerEventEveryTopicHandler<ConsumerClientInferEventsMap<TConsumerClient>, EventName>,
  ): void {
    return this.client.registerEventHandlerEveryTopic(this.namespace, eventHandler);
  }

  getEventHandlersEveryTopic(): IConsumerEventEveryTopicHandler<ConsumerClientInferEventsMap<TConsumerClient>, keyof ConsumerClientInferEventsMap<TConsumerClient>>[] {
    return this.client.getEventNamespaceEveryTopicHandlers(this.namespace);
  }

  getMetadataMap(item: object): Record<string | symbol, any> {
    return this._metadataWeakMap.get(item);
  }

  setMetadataMap(item: object, map: Record<string | symbol, any>): void {
    this._metadataWeakMap.set(item, map);
  }
}
