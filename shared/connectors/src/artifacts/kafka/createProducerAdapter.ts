import { ProducerKafkaAdapter } from '@packages/nestjs-connector-pubsub-kafka-adapter';

export interface CreateKafkaConnectorProducerClientOptions {
  brokers: string[];
  currentNamespace: string;
}

export function createProducerAdapter(config: CreateKafkaConnectorProducerClientOptions) {
  return new ProducerKafkaAdapter({
    client: { brokers: config.brokers, clientId: config.currentNamespace },
    clientTopic: (namespace) => namespace,
  });
}
