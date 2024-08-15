import { PubsubMessage } from './PubsubMessage';

export interface IConsumerWorkerHandler<TWorkerContext, TWorkerOptions> {
  callback(messages: PubsubMessage[], context: TWorkerContext): Promise<void>;
  options: TWorkerOptions;
}
