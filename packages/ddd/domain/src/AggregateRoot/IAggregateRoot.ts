import { ReadonlyListUpdatesCollection } from '@ddd/core';

import { IDomainEvent } from '../DomainEvent';
import { IEntity } from '../Entity';
import { IEntityKey } from '../EntityKey';

export interface IAggregateRoot<PrimaryKey extends IEntityKey> extends IEntity<PrimaryKey> {
  get events(): ReadonlyListUpdatesCollection<IDomainEvent>;
  clearEvents(): IDomainEvent[];
}
