import { PubsubMessage } from '@packages/berish-connector-pubsub';

export interface INestConsumerWorkerHandler<Message extends PubsubMessage<any>, WorkerContext extends Record<string, any> = Record<string, any>> {
  execute(messages: Message[], context: WorkerContext): Promise<void>;
}

export interface INestConsumerWorkerHandlerMethod<Message extends PubsubMessage<any>, WorkerContext extends Record<string, any> = Record<string, any>> {
  (messages: Message[], context: WorkerContext): Promise<void>;
}

export type INestConsumerWorkerHandlerMethodParameters<Message extends PubsubMessage<any>, WorkerContext extends Record<string, any> = Record<string, any>> = Parameters<
  INestConsumerWorkerHandlerMethod<Message, WorkerContext>
>;
