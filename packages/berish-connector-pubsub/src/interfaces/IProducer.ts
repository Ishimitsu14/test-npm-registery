import { IProducerAdapter, ProducerClientInferMessageInputOptions } from './IProducerAdapter';
import { PubsubMessageInput, PubsubMessageNamespaceInput } from './PubsubMessage';

export interface IProducer<TProducerClient extends IProducerAdapter<any>> {
  readonly namespace: string;
  readonly client: TProducerClient;

  addMessage(message: PubsubMessageInput<any, any, ProducerClientInferMessageInputOptions<TProducerClient>>): Promise<void>;
  addMessages(messages: PubsubMessageInput<any, any, ProducerClientInferMessageInputOptions<TProducerClient>>[]): Promise<void>;

  addNamespaceMessage(message: PubsubMessageNamespaceInput<any, any, ProducerClientInferMessageInputOptions<TProducerClient>>): Promise<void>;
  addNamespaceMessages(messages: PubsubMessageNamespaceInput<any, any, ProducerClientInferMessageInputOptions<TProducerClient>>[]): Promise<void>;
}
