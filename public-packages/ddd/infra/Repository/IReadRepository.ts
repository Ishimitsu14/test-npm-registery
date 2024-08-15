import { NullableObject } from '../../core';
import { Entity, EntityInferPrimaryKey } from '../../domain';
import { DbTransactionExecutePayload } from '../DbTransaction';
import { IBaseRepository } from './IBaseRepository';

export interface IReadRepository<TEntity extends Entity, DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload>
  extends IBaseRepository<TEntity, DbTransactionPayloadCustom> {
  fetch(entity: TEntity): Promise<TEntity | NullableObject>;
  fetchMany(entities: TEntity[]): Promise<(TEntity | NullableObject)[]>;

  get(primaryKey: EntityInferPrimaryKey<TEntity>): Promise<TEntity | NullableObject>;
  getMany(primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<(TEntity | NullableObject)[]>;
}
