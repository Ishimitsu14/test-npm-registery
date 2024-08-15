import { NullableObject } from '../../core';
import { Entity, EntityConstructor } from '../../domain';
import { IDbContext } from '../DbContext';
import { DbEntitySetTracker } from '../DbEntityTracker';
import { DbTransaction, DbTransactionExecuteFunction, DbTransactionExecutePayload } from '../DbTransaction';
import { DbSetTriggers } from './DbSetTriggers';
import { IDbSet } from './IDbSet';

export class BaseDbSet<TEntity extends Entity, DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload> implements IDbSet<TEntity, DbTransactionPayloadCustom> {
  public readonly dbContext: IDbContext<DbTransactionPayloadCustom>;
  public readonly entityType: EntityConstructor<TEntity>;
  public readonly tracker: DbEntitySetTracker<TEntity>;
  public readonly triggers: Readonly<DbSetTriggers<TEntity>>;

  constructor(dbContext: IDbContext<DbTransactionPayloadCustom>, entityType: EntityConstructor<TEntity>) {
    this.dbContext = dbContext;
    this.entityType = entityType;
    this.tracker = new DbEntitySetTracker(entityType);
    this.triggers = DbSetTriggers();
  }

  addTransaction(command: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): string {
    return this.dbContext.addTransaction(command, this.entityType);
  }

  getTransaction(transactionId: string): NullableObject | DbTransaction<DbTransactionPayloadCustom> {
    return this.dbContext.getTransaction(transactionId, this.entityType);
  }

  removeTransaction(transactionId: string): void;
  removeTransaction(transaction: DbTransaction<DbTransactionPayloadCustom>): void;
  removeTransaction(transactionFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;
  removeTransaction(arg0: string | DbTransaction<DbTransactionPayloadCustom> | DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;
  removeTransaction(arg0: string | DbTransaction<DbTransactionPayloadCustom> | DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void {
    return this.dbContext.removeTransaction(arg0);
  }

  listTransactions(): DbTransaction<DbTransactionPayloadCustom>[] {
    return this.dbContext.listTransactions(this.entityType);
  }

  cleanTransactions(): void {
    return this.dbContext.cleanTransactions(this.entityType);
  }

  saveChanges(): Promise<number> {
    return this.dbContext.saveChanges(this.entityType);
  }

  clean(): void {
    return this.dbContext.clean(this.entityType);
  }
}
