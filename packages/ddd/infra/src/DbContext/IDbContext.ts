import { NullableObject } from '@ddd/core';
import { Entity, EntityConstructor } from '@ddd/domain';

import { IDbContextHook } from '../DbContextHook';
import { IDbEntityTracker } from '../DbEntityTracker';
import { IDbSet } from '../DbSet';
import { DbTransaction, DbTransactionExecuteFunction, DbTransactionExecutePayload } from '../DbTransaction';
import { DbContextTriggers } from './DbContextTriggers';

export interface IDbContext<DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload> {
  get triggers(): Readonly<DbContextTriggers>;
  get tracker(): IDbEntityTracker;

  listDbSets(): IDbSet<Entity, DbTransactionPayloadCustom>[];
  getDbSet<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): IDbSet<TEntity, DbTransactionPayloadCustom>;

  addTransaction(transactionExecuteFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): string;
  addTransaction<TEntity extends Entity>(transactionExecuteFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>, entityType: EntityConstructor<TEntity>): string;

  getTransaction(transactionId: string): DbTransaction<DbTransactionPayloadCustom> | NullableObject;
  getTransaction<TEntity extends Entity>(transactionId: string, entityType: EntityConstructor<TEntity>): DbTransaction<DbTransactionPayloadCustom> | NullableObject;

  removeTransaction(transactionId: string): void;
  removeTransaction(transaction: DbTransaction<DbTransactionPayloadCustom>): void;
  removeTransaction(transactionFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;
  removeTransaction(arg0: string | DbTransaction<DbTransactionPayloadCustom> | DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;

  listTransactions(): DbTransaction<DbTransactionPayloadCustom>[];
  listTransactions<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): DbTransaction<DbTransactionPayloadCustom>[];

  cleanTransactions(): void;
  cleanTransactions<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): void;

  saveChanges(): Promise<number>;
  saveChanges<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): Promise<number>;

  clean<TEntity extends Entity>(): void;
  clean<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): void;

  enableHook(...hooks: IDbContextHook[]): Promise<void>;
  disableHooks(...hooks: IDbContextHook[]): Promise<void>;
  disableRegisteredHooks(): Promise<void>;
}
