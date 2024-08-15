import { Logger } from '@nestjs/common';

import { IProducerAdapter, PubsubMessageNamespaceInput } from '../interfaces';

export abstract class AbstractProducerAdapter<MessageInputOptions extends Record<string, any>> implements IProducerAdapter<MessageInputOptions> {
  protected logger = new Logger(this.constructor.name);

  public abstract connect(): Promise<void>;
  public abstract close(): Promise<void>;

  protected abstract dispatch(messages: PubsubMessageNamespaceInput<any, any, MessageInputOptions>[]): Promise<void>;

  async addMessages(messages: PubsubMessageNamespaceInput<any, any, MessageInputOptions>[]): Promise<void> {
    await this.connect();
    await this.dispatch(messages);
  }
}
