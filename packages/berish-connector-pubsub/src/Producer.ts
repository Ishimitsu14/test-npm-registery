import { IProducer, IProducerAdapter, ProducerClientInferMessageInputOptions, PubsubMessageInput, PubsubMessageNamespaceInput } from './interfaces';

export class Producer<TProducerClient extends IProducerAdapter<any>> implements IProducer<TProducerClient> {
  constructor(
    public readonly namespace: string,
    public readonly client: TProducerClient,
  ) {}

  addMessage(message: PubsubMessageInput<Record<string, any>, Record<string, any>, ProducerClientInferMessageInputOptions<TProducerClient>>): Promise<void> {
    return this.addMessages(message ? [message] : []);
  }

  addMessages(messages: PubsubMessageInput<Record<string, any>, Record<string, any>, ProducerClientInferMessageInputOptions<TProducerClient>>[]): Promise<void> {
    return this.addNamespaceMessages(messages.map((message) => ({ namespace: this.namespace, ...message })));
  }

  addNamespaceMessage(message: PubsubMessageNamespaceInput<any, any, ProducerClientInferMessageInputOptions<TProducerClient>>): Promise<void> {
    return this.addNamespaceMessages(message ? [message] : []);
  }

  addNamespaceMessages(messages: PubsubMessageNamespaceInput<any, any, ProducerClientInferMessageInputOptions<TProducerClient>>[]): Promise<void> {
    return this.client.addMessages(messages);
  }
}
