import { NullableObject } from '../../core';
import { Entity, EntityConstructor } from '../../domain';
import { IDbContext } from '../DbContext';
import { IDbEntitySetTracker } from '../DbEntityTracker';
import { DbTransaction, DbTransactionExecuteFunction, DbTransactionExecutePayload } from '../DbTransaction';
import { DbSetTriggers } from './DbSetTriggers';

export interface IDbSet<TEntity extends Entity, DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload> {
  /** Контекст */
  get dbContext(): IDbContext<DbTransactionPayloadCustom>;
  /** Триггеры */
  get triggers(): Readonly<DbSetTriggers<TEntity>>;

  /** Трекер для работы с объектами в памяти контекста */
  get tracker(): IDbEntitySetTracker<TEntity>;

  /** Тип сущности */
  get entityType(): EntityConstructor<TEntity>;

  /** Работа с транзакциями в памяти контекста */
  addTransaction(transactionFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): string;

  getTransaction(transactionId: string): DbTransaction<DbTransactionPayloadCustom> | NullableObject;

  removeTransaction(transactionId: string): void;
  removeTransaction(transaction: DbTransaction<DbTransactionPayloadCustom>): void;
  removeTransaction(transactionFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;
  removeTransaction(arg0: string | DbTransaction<DbTransactionPayloadCustom> | DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;

  listTransactions(): DbTransaction<DbTransactionPayloadCustom>[];

  cleanTransactions(): void;

  // Save changes
  saveChanges(): Promise<number>;
  clean(): void;
}
