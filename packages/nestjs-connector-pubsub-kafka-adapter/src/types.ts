import { IConsumerAdapter, IConsumerWorkerHandler, IProducerAdapter, PubsubMessageTopic } from '@packages/berish-connector-pubsub';
import { ConsumerConfig, ConsumerRunConfig, ConsumerSubscribeTopics, EachBatchPayload, KafkaConfig, ProducerConfig } from 'kafkajs';

export interface KafkaProducerClientOptions {
  postfixId?: string;
  client?: KafkaConfig;
  producer?: ProducerConfig;
  clientTopic?: (namespace: string, topic: PubsubMessageTopic) => string;
}

export interface KafkaMessageInputOptions {
  uniqueKey?: string;
  timestamp?: number | Date | string;
  acks?: number;
  timeout?: number;
}

export interface KafkaConsumerClientOptions {
  postfixId?: string;
  client?: KafkaConfig;
  clientTopic?: (namespace: string, topic: PubsubMessageTopic) => string;

  customGroupId?: string;
  consumer?: Omit<ConsumerConfig, keyof Pick<ConsumerConfig, 'groupId'>>;
  run?: Omit<ConsumerRunConfig, keyof Pick<ConsumerRunConfig, 'eachBatch' | 'eachMessage'>>;
  subscribe?: Omit<ConsumerSubscribeTopics, keyof Pick<ConsumerSubscribeTopics, 'topics'>>;
}

export type KafkaWorkerContext = EachBatchPayload;
export interface KafkaWorkerOptions {
  /** Как выдается результат: одиночно или пачками (Defaults eachMessage) */
  batchType?: 'eachMessage' | 'eachBatch';
}

export interface KafkaConsumerRegisteredTopicHandler {
  topic: PubsubMessageTopic;
  handler: IConsumerWorkerHandler<KafkaWorkerContext, KafkaWorkerOptions>;
}

export interface IKafkaProducerClient extends IProducerAdapter<KafkaMessageInputOptions> {}
export interface IKafkaConsumerClient extends IConsumerAdapter<KafkaWorkerContext, KafkaWorkerOptions, {}> {}
