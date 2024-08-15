import LINQ from '@berish/linq';
import { v4 } from 'uuid';

import { NullableObject } from '../../core';
import { Entity, EntityConstructor, EntityKey } from '../../domain';
import { DbContextHookRegisterInfo, IDbContextHook } from '../DbContextHook';
import { DbEntityTracker } from '../DbEntityTracker';
import { BaseDbSet, DbSetTriggers, IDbSet } from '../DbSet';
import { DbTransaction, DbTransactionExecuteFunction, DbTransactionExecutePayload, DbTransactionExecuteTriggers } from '../DbTransaction';
import { DbContextTriggers } from './DbContextTriggers';
import { IDbContext } from './IDbContext';

export abstract class BaseDbContext<DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload> implements IDbContext<DbTransactionPayloadCustom> {
  protected abstract execute(transactions: DbTransaction<DbTransactionPayloadCustom>[], payload: DbTransactionExecutePayload): Promise<void>;

  private _transactions: DbTransaction<DbTransactionPayloadCustom>[] = [];
  private _entityClassToDbSetMap: Map<EntityConstructor<Entity>, IDbSet<Entity, DbTransactionPayloadCustom>>;
  private _triggers: DbContextTriggers = DbContextTriggers();
  private _registeredHooks: Map<IDbContextHook, DbContextHookRegisterInfo> = new Map();
  private _tracker = new DbEntityTracker((entityType) => this.getDbSet(entityType).tracker); // TODO проверить tracker зависимости, потому что был рефакторинг DbSet

  constructor() {
    this._entityClassToDbSetMap = new Map();
  }

  get triggers(): Readonly<DbContextTriggers> {
    return this._triggers;
  }

  get tracker(): DbEntityTracker {
    return this._tracker;
  }

  get registeredHooks(): ReadonlyMap<IDbContextHook, DbContextHookRegisterInfo> {
    return this._registeredHooks;
  }

  listDbSets(): IDbSet<Entity<EntityKey>, DbTransactionPayloadCustom>[] {
    return [...this._entityClassToDbSetMap.values()];
  }

  getDbSet<TEntity extends Entity<EntityKey>>(entityType: EntityConstructor<TEntity>): BaseDbSet<TEntity, DbTransactionPayloadCustom> {
    if (!this._entityClassToDbSetMap.has(entityType)) {
      this._entityClassToDbSetMap.set(entityType, this.createSet(entityType));
    }
    return this._entityClassToDbSetMap.get(entityType) as BaseDbSet<TEntity, DbTransactionPayloadCustom>;
  }

  addTransaction(transactionExecuteFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): string;
  addTransaction<TEntity extends Entity<EntityKey>>(transactionExecuteFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>, entityType: EntityConstructor<TEntity>): string;
  addTransaction<TEntity extends Entity<EntityKey>>(transactionExecuteFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>, entityType?: EntityConstructor<TEntity>): string {
    const transactionId = v4();

    this._transactions.push({
      id: transactionId,
      execute: transactionExecuteFunction,
      entityType,
    });

    return transactionId;
  }

  getTransaction(transactionId: string): NullableObject | DbTransaction<DbTransactionPayloadCustom>;
  getTransaction<TEntity extends Entity<EntityKey>>(transactionId: string, entityType: EntityConstructor<TEntity>): NullableObject | DbTransaction<DbTransactionPayloadCustom>;
  getTransaction<TEntity extends Entity<EntityKey>>(transactionId: string, entityType?: EntityConstructor<TEntity>): NullableObject | DbTransaction<DbTransactionPayloadCustom> {
    const transactionIndex = this._transactions.findIndex((m) => m.id === transactionId && (entityType ? m.entityType === entityType : true));
    return this._transactions[transactionIndex];
  }

  removeTransaction(transactionId: string): void;
  removeTransaction(transaction: DbTransaction<DbTransactionPayloadCustom>): void;
  removeTransaction(transactionFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;
  removeTransaction(arg0: string | DbTransaction<DbTransactionPayloadCustom> | DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void;
  removeTransaction(arg0: string | DbTransaction<DbTransactionPayloadCustom> | DbTransactionExecuteFunction<DbTransactionPayloadCustom>): void {
    const transactionIndex = this._transactions.findIndex((m) => m === arg0 || m.id === arg0 || m.execute === arg0);
    this._transactions.splice(transactionIndex, 1);
  }

  listTransactions(): DbTransaction<DbTransactionPayloadCustom>[];
  listTransactions<TEntity extends Entity<EntityKey>>(entityType: EntityConstructor<TEntity>): DbTransaction<DbTransactionPayloadCustom>[];
  listTransactions<TEntity extends Entity<EntityKey>>(entityType?: EntityConstructor<TEntity>): DbTransaction<DbTransactionPayloadCustom>[] {
    if (entityType) return this._transactions.filter((m) => m.entityType === entityType);
    return this._transactions.slice();
  }

  cleanTransactions(): void;
  cleanTransactions<TEntity extends Entity<EntityKey>>(entityType: EntityConstructor<TEntity>): void;
  cleanTransactions<TEntity extends Entity<EntityKey>>(entityType?: EntityConstructor<TEntity>): void {
    if (entityType) {
      this._transactions = this._transactions.filter((m) => m.entityType !== entityType);
    } else {
      this._transactions = [];
    }
  }

  saveChanges(): Promise<number>;
  saveChanges<TEntity extends Entity<EntityKey>>(entityType: EntityConstructor<TEntity>): Promise<number>;
  async saveChanges<TEntity extends Entity<EntityKey>>(entityType?: EntityConstructor<TEntity>): Promise<number> {
    const transactionTriggers = DbTransactionExecuteTriggers();

    let transactions = this.listTransactions(entityType);
    if (transactions.length <= 0) return 0;

    {
      const entityTypes = LINQ.from(this.tracker.local(entityType).map((m) => m.entityType))
        .distinct()
        .toArray();
      await this.onBefore(transactionTriggers, entityTypes, transactions);
    }

    transactions = this.listTransactions(entityType); // Запрашиваем заново, потому что в триггере могли убрать какие-то транзакции

    {
      const entityTypes = LINQ.from(this.tracker.local(entityType).map((m) => m.entityType))
        .distinct()
        .toArray();
      await this.onExecute(transactionTriggers, entityTypes, transactions);
    }

    {
      await this.onSuccess(
        transactionTriggers,
        this.tracker.local(entityType).map((m) => m.entityType),
      );
    }

    // this.clean(entityType);

    return transactions.length;
  }

  clean<TEntity extends Entity<EntityKey>>(): void;
  clean<TEntity extends Entity<EntityKey>>(entityType: EntityConstructor<TEntity>): void;
  clean<TEntity extends Entity<EntityKey>>(entityType?: EntityConstructor<TEntity>): void {
    this.cleanTransactions(entityType);
    this.tracker.clear(entityType);
  }

  protected createSet<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): IDbSet<TEntity, DbTransactionPayloadCustom> {
    return new BaseDbSet(this, entityType);
  }

  private async onBefore(transactionTriggers: DbTransactionExecuteTriggers, entityTypes: EntityConstructor<any>[], transactions: DbTransaction<DbTransactionPayloadCustom>[]) {
    try {
      // DbContext
      await this.triggers.onBefore.executeActions(transactions.length);

      // DbSet
      await this._executeDbSetTriggers(entityTypes, async (triggers, _entityType) => {
        const attachedEntityTypeTransactions = transactions.filter((m) => m.entityType === _entityType);
        return triggers.onBefore.executeActions(attachedEntityTypeTransactions.length);
      });
    } catch (err) {
      await this.onFail(transactionTriggers, entityTypes, err);
    }
  }

  private async onExecute(transactionTriggers: DbTransactionExecuteTriggers, entityTypes: EntityConstructor<any>[], transactions: DbTransaction<DbTransactionPayloadCustom>[]) {
    try {
      const executePayload: DbTransactionExecutePayload = {
        transactionTriggers,
      };
      await this.execute(transactions, executePayload);
      return transactions.length;
    } catch (err) {
      await this.onFail(transactionTriggers, entityTypes, err);
    }
  }

  private async onSuccess(transactionTriggers: DbTransactionExecuteTriggers, entityTypes: EntityConstructor<any>[]) {
    try {
      // Transaction triggers
      await transactionTriggers.onSuccess.executeActions();

      // Global triggers
      await this._executeDbSetTriggers(entityTypes, async (triggers, _entityType) => triggers.onSuccess.executeActions());
      await this.triggers.onSuccess.executeActions();
    } catch (err) {
      await this.onFail(transactionTriggers, entityTypes, err);
    }
  }

  private async onFail(transactionTriggers: DbTransactionExecuteTriggers, entityTypes: EntityConstructor<any>[], err: any) {
    // Transaction triggers
    await transactionTriggers.onFail.executeActions();

    // Global triggers
    await this._executeDbSetTriggers(entityTypes, async (triggers, _entityType) => triggers.onFail.executeActions());
    await this.triggers.onFail.executeActions();

    throw err;
  }

  private async _executeDbSetTriggers<T>(
    entityTypes: EntityConstructor<Entity>[],
    executeCallback: (triggers: Readonly<DbSetTriggers<Entity<EntityKey>>>, entityType: EntityConstructor<Entity>) => Promise<number>,
  ): Promise<number> {
    entityTypes = LINQ.from(entityTypes)
      .distinct((m) => m)
      .toArray();

    let _err: unknown;
    let size = 0;

    for (const entityType of entityTypes) {
      const attachedEntityTypeDbSet = this.getDbSet(entityType);

      try {
        const dbSetSize = await executeCallback(attachedEntityTypeDbSet.triggers, entityType);
        size += dbSetSize;
      } catch (err) {
        if (!_err) _err = err;
      }
    }

    if (_err) throw _err;

    return size;
  }

  async enableHook(...hooks: IDbContextHook[]): Promise<void> {
    for (const hook of hooks) {
      const registerInfo: DbContextHookRegisterInfo = {};

      if (typeof hook.onBefore === 'function') registerInfo.onBeforeExecute = this.triggers.onBefore.addAction(hook.onBefore.bind(hook));
      if (typeof hook.onSuccess === 'function') registerInfo.onSuccessExecute = this.triggers.onSuccess.addAction(hook.onSuccess.bind(hook));
      if (typeof hook.onFail === 'function') registerInfo.onFailedExecute = this.triggers.onFail.addAction(hook.onFail.bind(hook));

      if (typeof hook.onEnabledHook === 'function') await hook.onEnabledHook.apply(hook);

      this._registeredHooks.set(hook, registerInfo);
    }
  }

  async disableHooks(...hooks: IDbContextHook[]): Promise<void> {
    for (const hook of hooks) {
      const registerInfo = this._registeredHooks.get(hook);
      if (!registerInfo) continue;

      if (registerInfo.onBeforeExecute) {
        this.triggers.onBefore.removeAction(registerInfo.onBeforeExecute);
      }

      if (registerInfo.onSuccessExecute) {
        this.triggers.onSuccess.removeAction(registerInfo.onSuccessExecute);
      }

      if (registerInfo.onFailedExecute) {
        this.triggers.onFail.removeAction(registerInfo.onFailedExecute);
      }

      if (typeof hook.onDisabledHook === 'function') await hook.onDisabledHook();

      this._registeredHooks.delete(hook);
    }
  }

  async disableRegisteredHooks(): Promise<void> {
    await this.disableHooks(...this._registeredHooks.keys());
  }
}
