import { Entity } from '@ddd/domain';

import { DbTransactionExecutePayload } from '../DbTransaction';
import { IReadRepository } from './IReadRepository';
import { IWriteRepository } from './IWriteRepository';

export interface IRepository<TEntity extends Entity, DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload>
  extends IWriteRepository<TEntity, DbTransactionPayloadCustom>,
    IReadRepository<TEntity, DbTransactionPayloadCustom> {}
