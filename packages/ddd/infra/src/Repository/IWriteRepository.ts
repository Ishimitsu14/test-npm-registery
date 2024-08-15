import { Entity, EntityInferPrimaryKey } from '@ddd/domain';

import { DbTransactionExecutePayload } from '../DbTransaction';
import { IBaseRepository } from './IBaseRepository';

export interface IWriteRepository<TEntity extends Entity, TransactionPayload extends DbTransactionExecutePayload = DbTransactionExecutePayload> extends IBaseRepository<TEntity, TransactionPayload> {
  add(entity: TEntity): void;
  addMany(entities: TEntity[]): void;

  update(entity: TEntity): void;
  updateMany(entities: TEntity[]): void;

  upsert(entity: TEntity): void;
  upsertMany(entities: TEntity[]): void;

  remove(entity: TEntity): void;
  removeMany(entities: TEntity[]): void;

  removeByPK(primaryKey: EntityInferPrimaryKey<TEntity>): void;
  removeManyByPKs(primaryKeys: EntityInferPrimaryKey<TEntity>[]): void;
}
