import { IDomainEvent } from '@ddd/domain';

import { MediatorRegistrator } from '../Mediator';
import { IDomainEventTrigger } from './IDomainEventTrigger';

export class DomainEventBus {
  private _mediatorRegistrator = new MediatorRegistrator<IDomainEvent>();

  get entries() {
    return this._mediatorRegistrator.entries.slice();
  }

  registerTriggers(triggers: IDomainEventTrigger<IDomainEvent>[]) {
    this._mediatorRegistrator.registerTriggerMany(triggers);
  }

  async executeDomainEvent(domainEvent: IDomainEvent): Promise<void> {
    const triggers = this._mediatorRegistrator.resolveTriggersByNotification<IDomainEventTrigger<IDomainEvent>>(domainEvent);
    for (const trigger of triggers) {
      await trigger.execute(domainEvent);
    }
  }
}
