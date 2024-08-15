import LINQ from '@berish/linq';
import { AggregateRoot, IDomainEvent } from '@ddd/domain';
import { DomainEventBus } from '@ddd/events';
import { IDbContext, IDbContextHook } from '@ddd/infra';

export class DomainEventsAggregateOnBeforeExecuteHook implements IDbContextHook {
  constructor(
    private dbContext: IDbContext,
    private domainEventBus: DomainEventBus,
  ) {}

  async onBefore(): Promise<void> {
    await this.executeCircular();
  }

  async onSuccess(): Promise<void> {
    this.clearAllEvents();
  }

  private async executeCircular(prevEvents: IDomainEvent[] = []) {
    const newEvents = this.getEvents(prevEvents);
    if (newEvents.length <= 0) return;

    await this.executeTriggers(newEvents);
    await this.executeCircular(prevEvents.concat(newEvents));
  }

  private async executeTriggers(events: IDomainEvent[]) {
    for (const event of events) {
      await this.domainEventBus.executeDomainEvent(event);
    }
  }

  private getEvents(prevEvents: IDomainEvent[]) {
    const localEntries = this.dbContext.tracker.local();

    const aggregates = localEntries.map((m) => m.entity).filter((m) => AggregateRoot.isExtends(m)) as AggregateRoot[];
    const events = LINQ.from(aggregates)
      .selectMany((m) => m.events.items.slice())
      .orderByAscending((m) => +m.createdAt)
      .filter((event) => prevEvents.findIndex((prevEvent) => prevEvent.isEquals(event)) === -1)
      .toArray();

    return events;
  }

  private clearAllEvents() {
    const localEntries = this.dbContext.tracker.local();
    const aggregates = localEntries.map((m) => m.entity).filter((m) => AggregateRoot.isExtends(m)) as AggregateRoot[];

    for (const aggregate of aggregates) {
      aggregate.clearEvents();
    }
  }
}
