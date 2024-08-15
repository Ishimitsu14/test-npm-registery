import { KafkaLogger } from '@nestjs/microservices';
import { AbstractConsumerAdapter, IConsumerEventHandler, IConsumerWorkerHandler, PubsubMessage, PubsubMessageTopic } from '@packages/berish-connector-pubsub';
import { Consumer, EachBatchPayload, Kafka, KafkaConfig, KafkaJSError } from 'kafkajs';
import * as wildcard from 'wildcard';

import { KAFKA_CONNECTOR_DEFAULT_BROKERS, KAFKA_CONNECTOR_DEFAULT_CONSUMER_POSTFIX_ID, KAKFA_CONNECTOR_DEFAULT_CLIENT_ID } from './const';
import { KafkaMessageMapper } from './KafkaMessageMapper';
import { IKafkaConsumerClient, KafkaConsumerClientOptions, KafkaConsumerRegisteredTopicHandler, KafkaWorkerContext, KafkaWorkerOptions } from './types';

export class ConsumerKafkaAdapter extends AbstractConsumerAdapter<KafkaWorkerContext, KafkaWorkerOptions, {}> implements IKafkaConsumerClient {
  protected messageMapper = new KafkaMessageMapper();
  protected getClientTopic: KafkaConsumerClientOptions['clientTopic'] = null;
  protected clientId: string = null;
  protected brokers: string[] | (() => string[] | Promise<string[]>) = null;

  protected client: Kafka = null;
  protected consumer: Consumer = null;
  protected clientTopicToTopicHandlerArray: Map<string, KafkaConsumerRegisteredTopicHandler[]> = new Map();

  constructor(private readonly options: KafkaConsumerClientOptions) {
    super();

    const kafkaClientOptions = options.client || ({} as KafkaConfig);
    const postfixId = options.postfixId || KAFKA_CONNECTOR_DEFAULT_CONSUMER_POSTFIX_ID;

    this.getClientTopic = options.clientTopic || ((namespace, topic) => `${namespace}${topic.topic}`);
    this.brokers = kafkaClientOptions.brokers || KAFKA_CONNECTOR_DEFAULT_BROKERS;
    this.clientId = [kafkaClientOptions.clientId || KAKFA_CONNECTOR_DEFAULT_CLIENT_ID, postfixId].join('');

    this.client = this.createClient();
    this.consumer = this.client.consumer({ groupId: this.clientId, ...this.options.consumer });
  }

  public async connect(): Promise<void> {
    await this.connectConsumers();
  }

  public close(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async bindWorkerTopicHandler(namespace: string, topic: PubsubMessageTopic, handler: IConsumerWorkerHandler<EachBatchPayload, KafkaWorkerOptions>): Promise<void> {
    const clientTopic = this.getClientTopic(namespace, topic);
    let kafkaHandlers = this.clientTopicToTopicHandlerArray.get(clientTopic);
    if (!kafkaHandlers) {
      kafkaHandlers = [];
      this.clientTopicToTopicHandlerArray.set(clientTopic, kafkaHandlers);
    }

    kafkaHandlers.push({
      topic,
      handler,
    });
  }

  async bindEventTopicHandlers(namespace: string, topic: PubsubMessageTopic, handlers: IConsumerEventHandler<{}, never>[]): Promise<void> {
    throw new Error('Bind event handlers not supported now.');
  }

  private async connectConsumers() {
    const clientTopics = [...this.clientTopicToTopicHandlerArray.keys()];
    await this.consumer.connect();
    await this.consumer.subscribe({ fromBeginning: true, ...this.options.subscribe, topics: clientTopics });
    await this.consumer.run({
      eachBatchAutoResolve: true,
      ...this.options.run,
      eachBatch: this.getConsumerHandlerBatch(),
    });
  }

  private getConsumerHandlerBatch() {
    return async (payload: EachBatchPayload) => {
      const clientTopicHandlers = this.clientTopicToTopicHandlerArray.get(payload.batch.topic);
      if (clientTopicHandlers.length <= 0) {
        throw new KafkaJSError(`[KAFKA_CONNECTOR] Wrong income message topic with subscribed. Not found client topic ${payload.batch.topic}`);
      }

      const messages = payload.batch.messages.map((message) => this.messageMapper.deserialize(message));
      if (messages.length <= 0) return undefined;

      const eachBatchHandlers = clientTopicHandlers.filter(({ handler }) => handler.options?.batchType === 'eachBatch');
      const eachMessageHandlers = clientTopicHandlers.filter(({ handler }) => (handler.options?.batchType ?? 'eachMessage') === 'eachMessage');

      await Promise.all([this.eachBatchHandlersConsume(eachBatchHandlers, messages, payload), this.eachMessageHandlersConsume(eachMessageHandlers, messages, payload)]);
    };
  }

  private async eachBatchHandlersConsume(handlers: KafkaConsumerRegisteredTopicHandler[], messages: PubsubMessage[], context: EachBatchPayload) {
    await Promise.all(
      handlers.map(({ topic, handler }) => {
        const topicMessages = messages.filter((m) => wildcard(topic.topic, m.key.topic));
        if (topicMessages.length <= 0) return undefined;

        return handler.callback(topicMessages, context);
      }),
    );
  }

  private async eachMessageHandlersConsume(handlers: KafkaConsumerRegisteredTopicHandler[], messages: PubsubMessage[], context: EachBatchPayload) {
    await Promise.all(
      handlers.map(async ({ topic, handler }) => {
        const topicMessages = messages.filter((m) => wildcard(topic.topic, m.key.topic));
        if (topicMessages.length <= 0) return undefined;

        for (const message of messages) {
          await handler.callback([message], context);
          await context.heartbeat();
        }
      }),
    );
  }

  private createClient() {
    return new Kafka({
      logCreator: KafkaLogger.bind(null, this.logger),
      ...this.options.client,
      brokers: this.brokers,
      clientId: this.clientId,
    });
  }
}
