import { IProducerAdapter, Producer } from '@packages/berish-connector-pubsub';

export interface CreateProducerOptions {
  namespace: string;
  adapter: IProducerAdapter<any>;
}

export function createProducer({ namespace, adapter }: CreateProducerOptions) {
  return new Producer(namespace, adapter);
}
