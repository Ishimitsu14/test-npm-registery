import { NullableObject } from '../../core';
import { Entity, EntityInferPrimaryKey } from '../../domain';
import { DbTransactionExecutePayload } from '../DbTransaction';

export interface IWriteHooksRepository<TEntity extends Entity, TransactionPayload extends DbTransactionExecutePayload = DbTransactionExecutePayload> {
  useAddRange(entities: TEntity[], callbackAdd: (payload: TransactionPayload, entities: TEntity[]) => Promise<(TEntity | NullableObject)[]>): void;
  useUpdateRange(entities: TEntity[], callbackUpdate: (payload: TransactionPayload, entities: TEntity[]) => Promise<(TEntity | NullableObject)[]>): void;
  useRemoveRange(entities: (TEntity | EntityInferPrimaryKey<TEntity>)[], callbackRemove: (payload: TransactionPayload, primaryKeys: EntityInferPrimaryKey<TEntity>[]) => Promise<void | void[]>): void;
}
