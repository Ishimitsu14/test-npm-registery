import LINQ from '@berish/linq';
import { KafkaLogger } from '@nestjs/microservices';
import { AbstractProducerAdapter, PubsubMessageNamespaceInput } from '@packages/berish-connector-pubsub';
import { Kafka, KafkaConfig, Message, Producer } from 'kafkajs';

import { KAFKA_CONNECTOR_DEFAULT_BROKERS, KAFKA_CONNECTOR_DEFAULT_PRODUCER_POSTFIX_ID, KAKFA_CONNECTOR_DEFAULT_CLIENT_ID } from './const';
import { KafkaMessageMapper } from './KafkaMessageMapper';
import { IKafkaProducerClient, KafkaMessageInputOptions, KafkaProducerClientOptions } from './types';

export class ProducerKafkaAdapter extends AbstractProducerAdapter<KafkaMessageInputOptions> implements IKafkaProducerClient {
  protected messageMapper = new KafkaMessageMapper();
  protected getClientTopic: KafkaProducerClientOptions['clientTopic'] = null;
  protected client: Kafka = null;
  protected producer: Producer = null;
  protected clientId: string = null;
  protected brokers: string[] | (() => string[] | Promise<string[]>) = null;

  constructor(private readonly options: KafkaProducerClientOptions) {
    super();

    const kafkaClientOptions = options.client || ({} as KafkaConfig);
    const postfixId = options.postfixId || KAFKA_CONNECTOR_DEFAULT_PRODUCER_POSTFIX_ID;

    this.getClientTopic = options.clientTopic || ((namespace, topic) => `${namespace}${topic.topic}`);
    this.brokers = kafkaClientOptions.brokers || KAFKA_CONNECTOR_DEFAULT_BROKERS;
    this.clientId = [kafkaClientOptions.clientId || KAKFA_CONNECTOR_DEFAULT_CLIENT_ID, postfixId].join('');
  }

  public async connect(): Promise<void> {
    if (this.client) return undefined;

    this.client = this.createClient();
    this.producer = this.client.producer(this.options.producer);
    await this.producer.connect();
  }

  public async close(): Promise<void> {
    if (this.producer) await this.producer.disconnect();

    this.producer = null;
    this.client = null;
  }

  protected async dispatch(messages: PubsubMessageNamespaceInput<any, any, KafkaMessageInputOptions>[]): Promise<void> {
    messages = messages.filter((m) => Boolean(m) && Boolean(m.key));

    if (messages.length <= 0) return undefined;

    const acks = this.getAcks(messages);
    const timeout = this.getTimeout(messages);
    const groupByClientTopic = LINQ.from(messages)
      .groupBy((m) => this.getClientTopic(m.namespace, m.key))
      .toArray()
      .map<[string, Message[]]>(([topic, messages]) => [topic, messages.toArray().map((message) => this.messageMapper.serialize(message))]);

    if (groupByClientTopic.length === 1) {
      const [topic, messages] = groupByClientTopic[0];
      await this.producer.send({ topic, messages, acks, timeout });
    } else {
      await this.producer.sendBatch({ topicMessages: groupByClientTopic.map(([topic, messages]) => ({ topic, messages })), acks, timeout });
    }
  }

  private getAcks(messages: PubsubMessageNamespaceInput<any, any, KafkaMessageInputOptions>[]) {
    const acks = messages.map((m) => m.messageOptions?.acks).filter((m) => (m ?? null) !== null);
    if (acks.length <= 0 || acks.some((m) => m === -1)) return -1;
    return LINQ.from(acks).maxValue();
  }

  private getTimeout(messages: PubsubMessageNamespaceInput<any, any, KafkaMessageInputOptions>[]) {
    const timeouts = messages.map((m) => m.messageOptions?.timeout).filter((m) => (m ?? null) !== null);
    if (timeouts.length <= 0) return undefined;
    return LINQ.from(timeouts).maxValue();
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
