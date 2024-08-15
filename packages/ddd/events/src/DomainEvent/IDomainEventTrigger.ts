import { IDomainEvent } from '@ddd/domain';

export interface IDomainEventTrigger<T extends IDomainEvent> {
  execute(event: T): Promise<void>;
}
