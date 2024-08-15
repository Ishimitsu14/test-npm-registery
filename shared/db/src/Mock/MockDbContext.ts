import { BaseDbContext, DbTransaction, DbTransactionExecutePayload } from '@ddd/infra';
import { Inject } from '@nestjs/common';

import { IMockDbContext, MockDbTransactionExecutePayload } from './Interfaces';
import { MockStoreRegistry } from './MockStore';

export class MockDbContext extends BaseDbContext<MockDbTransactionExecutePayload> implements IMockDbContext {
  @Inject(MockStoreRegistry)
  private readonly mockStoreRegistry: MockStoreRegistry;

  protected async execute(transactions: DbTransaction<MockDbTransactionExecutePayload>[], payload: DbTransactionExecutePayload): Promise<void> {
    await this.mockStoreRegistry.transaction(async (registry) => {
      for (const transaction of transactions) {
        await transaction.execute({ registry, ...payload });
      }
    });
  }
}
