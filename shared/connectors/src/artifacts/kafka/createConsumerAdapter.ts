import { ConsumerKafkaAdapter } from '@packages/nestjs-connector-pubsub-kafka-adapter';

export interface CreateKafkaConnectorConsumerClientOptions {
  brokers: string[];
  currentNamespace: string;
}

export function createConsumerAdapter(config: CreateKafkaConnectorConsumerClientOptions) {
  return new ConsumerKafkaAdapter({
    client: { brokers: config.brokers, clientId: config.currentNamespace },
    customGroupId: config.currentNamespace,
    clientTopic: (namespace, topic) => namespace,
  });
}
