import { IDomainEvent } from '../../domain';

export interface IDomainEventTrigger<T extends IDomainEvent> {
  execute(event: T): Promise<void>;
}
