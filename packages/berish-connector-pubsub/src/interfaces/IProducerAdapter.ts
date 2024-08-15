import { PubsubMessageNamespaceInput } from './PubsubMessage';

export interface IProducerAdapter<MessageInputOptions extends Record<string, any>> {
  connect(): Promise<void>;
  close(): Promise<void>;

  addMessages(messages: PubsubMessageNamespaceInput<any, any, MessageInputOptions>[]): Promise<void>;
}

export type ProducerClientInferMessageInputOptions<T> = T extends IProducerAdapter<infer MessageInputOptions> ? MessageInputOptions : never;
