import { BaseDbContext } from '@ddd/infra';
import { Inject } from '@nestjs/common';
import { NestDomainEventBus } from '@shared/events';

import { IUnitOfWork } from '../../Application';
import { DomainEventsAggregateOnBeforeExecuteHook } from './Hooks';

export class UnitOfWork implements IUnitOfWork {
  constructor(
    @Inject(BaseDbContext)
    private dbContext: BaseDbContext,
    @Inject(NestDomainEventBus)
    private nestDomainEventBus: NestDomainEventBus,
  ) {
    this.dbContext.enableHook(new DomainEventsAggregateOnBeforeExecuteHook(dbContext, nestDomainEventBus.domainEventBus));
  }

  async commit() {
    await this.dbContext.saveChanges();
  }
}
