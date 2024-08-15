import { BaseDbContext } from '@ddd/infra';
import { Inject } from '@nestjs/common';

import { IUnitOfWork } from '../../Application';

export class UnitOfWork implements IUnitOfWork {
  @Inject(BaseDbContext)
  private dbContext: BaseDbContext;

  async commit() {
    await this.dbContext.saveChanges();
  }
}
