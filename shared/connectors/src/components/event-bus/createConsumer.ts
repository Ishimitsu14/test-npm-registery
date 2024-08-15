import { Consumer, IConsumerAdapter } from '@packages/berish-connector-pubsub';

export interface CreateConsumerOptions {
  namespace: string;
  adapter: IConsumerAdapter<any, any, any>;
}

export function createConsumer({ namespace, adapter }: CreateConsumerOptions) {
  return new Consumer(namespace, adapter);
}
