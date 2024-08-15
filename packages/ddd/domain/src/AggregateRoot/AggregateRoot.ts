import { ListUpdatesCollection } from '@ddd/core';

import { IDomainEvent } from '../DomainEvent';
import { Entity } from '../Entity';
import { EntityKey } from '../EntityKey';
import { IAggregateRoot } from './IAggregateRoot';

export abstract class AggregateRoot<PrimaryKey extends EntityKey = EntityKey> extends Entity<PrimaryKey> implements IAggregateRoot<PrimaryKey> {
  private readonly _eventsCollection = new ListUpdatesCollection<IDomainEvent>();

  get events() {
    return this._eventsCollection.asReadonly();
  }

  clearEvents(): IDomainEvent[] {
    return this._eventsCollection.clear();
  }

  protected addEvent(event: IDomainEvent) {
    this._eventsCollection.add(event);
  }

  protected removeEvent(event: IDomainEvent) {
    this._eventsCollection.remove(event);
  }
}
