import { Logger } from '@nestjs/common';

import { IConsumerAdapter, IConsumerEventEveryTopicHandler, IConsumerEventHandler, IConsumerWorkerHandler, PubsubMessageTopic } from '../interfaces';

export abstract class AbstractConsumerAdapter<WorkerContext extends Record<string, any>, WorkerOptions extends Record<string, any>, EventsMap extends Record<string, (...args: any) => any>>
  implements IConsumerAdapter<WorkerContext, WorkerOptions, EventsMap>
{
  protected _isStarted = false;
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly workerHandlers: Map<string, [PubsubMessageTopic, IConsumerWorkerHandler<WorkerContext, WorkerOptions>][]> = new Map();
  protected readonly eventHandlers: Map<string, [PubsubMessageTopic, IConsumerEventHandler<EventsMap, keyof EventsMap>[]][]> = new Map();
  protected readonly eventEveryTopicHandlers: Map<string, IConsumerEventEveryTopicHandler<EventsMap, keyof EventsMap>[]> = new Map();

  public abstract connect(): Promise<void>;
  public abstract close(): Promise<void>;

  public abstract bindWorkerTopicHandler(namespace: string, topic: PubsubMessageTopic, handler: IConsumerWorkerHandler<WorkerContext, WorkerOptions>): Promise<void>;
  public abstract bindEventTopicHandlers(namespace: string, topic: PubsubMessageTopic, handlers: IConsumerEventHandler<EventsMap, keyof EventsMap>[]): Promise<void>;

  async start(): Promise<void> {
    if (this._isStarted) return undefined;
    this._isStarted = true;

    try {
      this.bind();
      await this.connect();
    } catch (err) {
      this._isStarted = false;
      throw err;
    }
  }

  async stop(): Promise<void> {
    if (!this._isStarted) return undefined;
    this._isStarted = false;

    try {
      await this.close();
    } catch (err) {
      this._isStarted = true;
      throw err;
    }
  }

  get isStarted() {
    return this._isStarted;
  }

  async bind(): Promise<void> {
    await this.bindWorkerHandlers();
    await this.bindEventHandlers();
  }

  public async bindWorkerHandlers(): Promise<void> {
    const workerHandlers = this.getWorkerHandlers();

    await Promise.all(
      [...workerHandlers].map(async ([namespace, namespaceHandlers]) => {
        await Promise.all(namespaceHandlers.map(([topic, topicHandler]) => this.bindWorkerTopicHandler(namespace, topic, topicHandler)));
      }),
    );
  }

  public async bindEventHandlers(): Promise<void> {
    const eventHandlers = this.getEventHandlers();
    const eventEveryTopicHandlers = this.getEventEveryTopicHandlers();

    await Promise.all(
      [...eventHandlers].map(
        async ([namespace, namespaceHandlers]) => await Promise.all(namespaceHandlers.map(([topic, topicHandlers]) => this.bindEventTopicHandlers(namespace, topic, topicHandlers))),
      ),
    );

    await Promise.all(
      [...eventEveryTopicHandlers].map(async ([namespace, namespaceHandlers]) => {
        const workerNamespaceHandlers = this.getWorkerNamespaceHandlers(namespace).map(([topic]) => topic);

        await Promise.all(
          workerNamespaceHandlers.map(async (topic) => {
            const handlers = namespaceHandlers.map<IConsumerEventHandler<EventsMap, keyof EventsMap>>((handler) => ({
              callback: (...args) => handler.callback(topic, ...args),
              eventName: handler.eventName,
            }));

            await this.bindEventTopicHandlers(namespace, topic, handlers);
          }),
        );
      }),
    );
  }

  registerWorkerHandler(namespace: string, topic: PubsubMessageTopic, handler: IConsumerWorkerHandler<WorkerContext, WorkerOptions>): void {
    const workerNamespaceHandlers = this.getWorkerNamespaceHandlers(namespace);

    const topicRecord = workerNamespaceHandlers.find(([_topic]) => _topic.topic === topic.topic);
    if (topicRecord) {
      this.logger.warn(`Duplicated register worker ${namespace}.${topic.topic}`);
      topicRecord[1] = handler;
      return undefined;
    }

    workerNamespaceHandlers.push([topic, handler]);
  }

  getWorkerHandlers(): Map<string, [PubsubMessageTopic, IConsumerWorkerHandler<WorkerContext, WorkerOptions>][]> {
    return this.workerHandlers;
  }

  getWorkerNamespaceHandlers(namespace: string): [PubsubMessageTopic, IConsumerWorkerHandler<WorkerContext, WorkerOptions>][] {
    let workerNamespaceHandlers = this.workerHandlers.get(namespace);
    if (!workerNamespaceHandlers) {
      workerNamespaceHandlers = [];
      this.workerHandlers.set(namespace, workerNamespaceHandlers);
    }
    return workerNamespaceHandlers;
  }

  getWorkerNamespaceTopicHandler(namespace: string, topic: PubsubMessageTopic): IConsumerWorkerHandler<WorkerContext, WorkerOptions> {
    const workerNamespaceHandlers = this.getWorkerNamespaceHandlers(namespace);

    const topicRecord = workerNamespaceHandlers.find(([_topic]) => _topic.topic === topic.topic);
    return topicRecord && topicRecord[1];
  }

  getWorkerNamespaceTopicHandlerOptions(namespace: string, topic: PubsubMessageTopic): WorkerOptions {
    const workerNamespaceTopicHandler = this.getWorkerNamespaceTopicHandler(namespace, topic);
    return workerNamespaceTopicHandler && workerNamespaceTopicHandler.options;
  }

  registerEventHandler<EventName extends keyof EventsMap>(namespace: string, topic: PubsubMessageTopic, eventHandler: IConsumerEventHandler<EventsMap, EventName>): void {
    const eventNamespaceTopicHandlers = this.getEventNamespaceTopicHandlers(namespace, topic);
    eventNamespaceTopicHandlers.push(eventHandler);
  }

  getEventHandlers(): Map<string, [PubsubMessageTopic, IConsumerEventHandler<EventsMap, keyof EventsMap>[]][]> {
    return this.eventHandlers;
  }

  getEventNamespaceHandlers(namespace: string): [PubsubMessageTopic, IConsumerEventHandler<EventsMap, keyof EventsMap>[]][] {
    let eventNamespaceHandlers = this.eventHandlers.get(namespace);
    if (!eventNamespaceHandlers) {
      eventNamespaceHandlers = [];
      this.eventHandlers.set(namespace, eventNamespaceHandlers);
    }
    return eventNamespaceHandlers;
  }

  getEventNamespaceTopicHandlers(namespace: string, topic: PubsubMessageTopic): IConsumerEventHandler<EventsMap, keyof EventsMap>[] {
    const eventNamespaceHandlers = this.getEventNamespaceHandlers(namespace);

    let topicRecord = eventNamespaceHandlers.find(([_topic]) => _topic.topic === topic.topic);
    if (!topicRecord) {
      topicRecord = [topic, []];
      eventNamespaceHandlers.push(topicRecord);
    }
    return topicRecord && topicRecord[1];
  }

  registerEventHandlerEveryTopic<EventName extends keyof EventsMap>(namespace: string, eventHandler: IConsumerEventEveryTopicHandler<EventsMap, EventName>): void {
    const eventNamespaceEveryTopicHandlers = this.getEventNamespaceEveryTopicHandlers(namespace);
    eventNamespaceEveryTopicHandlers.push(eventHandler);
  }

  getEventEveryTopicHandlers(): Map<string, IConsumerEventEveryTopicHandler<EventsMap, keyof EventsMap>[]> {
    return this.eventEveryTopicHandlers;
  }

  getEventNamespaceEveryTopicHandlers(namespace: string): IConsumerEventEveryTopicHandler<EventsMap, keyof EventsMap>[] {
    let eventNamespaceEveryTopicHandlers = this.eventEveryTopicHandlers.get(namespace);
    if (!eventNamespaceEveryTopicHandlers) {
      eventNamespaceEveryTopicHandlers = [];
      this.eventEveryTopicHandlers.set(namespace, eventNamespaceEveryTopicHandlers);
    }
    return eventNamespaceEveryTopicHandlers;
  }

  protected getOptionsProp<Options extends Record<string, any>, K extends keyof Options>(obj: Options, prop: K, defaultValue: Options[K] = undefined) {
    return (obj && obj[prop]) || defaultValue;
  }
}
