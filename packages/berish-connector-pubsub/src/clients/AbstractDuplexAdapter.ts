import { IConsumerAdapter, IProducerAdapter, PubsubMessageNamespaceInput } from '../interfaces';
import { AbstractConsumerAdapter } from './AbstractConsumerAdapter';

export abstract class AbstractDuplexAdapter<
    MessageInputOptions extends Record<string, any>,
    WorkerContext extends Record<string, any>,
    WorkerOptions extends Record<string, any>,
    EventsMap extends Record<string, (...args: any) => any>,
  >
  extends AbstractConsumerAdapter<WorkerContext, WorkerOptions, EventsMap>
  implements IConsumerAdapter<WorkerContext, WorkerOptions, EventsMap>, IProducerAdapter<MessageInputOptions>
{
  public abstract connect(): Promise<void>;
  public abstract close(): Promise<void>;

  protected abstract dispatch(messages: PubsubMessageNamespaceInput<any, any, MessageInputOptions>[]): Promise<void>;

  async addMessages(messages: PubsubMessageNamespaceInput<any, any, MessageInputOptions>[]): Promise<void> {
    await this.connect();
    await this.dispatch(messages);
  }
}
