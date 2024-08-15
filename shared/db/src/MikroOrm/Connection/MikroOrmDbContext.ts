import { BaseDbContext, DbTransaction, DbTransactionExecutePayload } from '@ddd/infra';
import { Inject } from '@nestjs/common';

import { MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN, MIKRO_ORM_INJECT_TOKEN } from '../InjectTokens';
import { IMikroOrmDbContext, MikroOrmDbTransactionExecutePayload } from '../Interfaces';

export class MikroOrmDbContext extends BaseDbContext<MikroOrmDbTransactionExecutePayload> implements IMikroOrmDbContext {
  @Inject(MIKRO_ORM_INJECT_TOKEN)
  protected orm: MIKRO_ORM_INJECT_TOKEN;

  @Inject(MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN)
  protected entityManager: MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN;

  protected async execute(transactions: DbTransaction<MikroOrmDbTransactionExecutePayload>[], payload: DbTransactionExecutePayload): Promise<void> {
    await this.entityManager.transactional(async (em) => {
      for (const transaction of transactions) {
        await transaction.execute({ orm: this.orm, manager: em, ...payload });
      }
    });
  }
}
