import { NullableObject } from '../../core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '../../domain';
import { IDbContext } from '../DbContext';
import { IDbEntityEntry, IDbEntityTracker } from '../DbEntityTracker';
import { DbTransactionExecuteFunction, DbTransactionExecutePayload } from '../DbTransaction';
import { IBaseRepository } from './IBaseRepository';
import { IReadHooksRepository, ReadRepositoryUseFetchOptions, ReadRepositoryUseFindOptions, ReadRepositoryUseFindPrimaryKeyOptions } from './IReadHooksRepository';
import { IRepository } from './IRepository';
import { IWriteHooksRepository } from './IWriteHooksRepository';

export abstract class BaseRepository<TEntity extends Entity, TransactionPayload extends DbTransactionExecutePayload = DbTransactionExecutePayload>
  implements IBaseRepository<TEntity, TransactionPayload>, IRepository<TEntity, TransactionPayload>, IWriteHooksRepository<TEntity, TransactionPayload>, IReadHooksRepository<TEntity>
{
  abstract get dbContext(): IDbContext<TransactionPayload>;
  abstract get EntityType(): EntityConstructor<TEntity>;

  abstract addMany(entities: TEntity[]): void;
  abstract updateMany(entities: TEntity[]): void;
  abstract upsertMany(entities: TEntity[]): void;
  abstract removeMany(entities: TEntity[]): void;
  abstract removeManyByPKs(primaryKeys: EntityInferPrimaryKey<TEntity>[]): void;
  abstract fetchMany(entities: TEntity[]): Promise<(TEntity | NullableObject)[]>;
  abstract getMany(primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<(TEntity | NullableObject)[]>;

  get tracker(): IDbEntityTracker {
    return this.dbContext.tracker;
  }

  add(entity: TEntity): void {
    return this.addMany([entity]);
  }

  update(entity: TEntity): void {
    return this.updateMany([entity]);
  }

  upsert(entity: TEntity): void {
    return this.upsertMany([entity]);
  }

  remove(entity: TEntity): void {
    return this.removeMany([entity]);
  }

  removeByPK(primaryKey: EntityInferPrimaryKey<TEntity>): void {
    return this.removeManyByPKs([primaryKey]);
  }

  fetch(entity: TEntity): Promise<TEntity | NullableObject> {
    return this.fetchMany([entity]).then(([entity]) => entity);
  }

  get(primaryKey: EntityInferPrimaryKey<TEntity>): Promise<TEntity | NullableObject> {
    return this.getMany([primaryKey]).then(([entity]) => entity);
  }

  useTrackingAfterQuery(entity: NullableObject | TEntity, updateState?: boolean): NullableObject | TEntity {
    if (NullableObject.isEmpty(entity)) return NullableObject;

    const entry = this.tracker.getEntry(entity);
    if (updateState) {
      this.tracker.apply(entry, entity);
    } else {
      this.tracker.find(entity);
    }

    return entry.entity;
  }

  useTrackingManyAfterQuery(entities: (NullableObject | TEntity)[], updateState?: boolean): (NullableObject | TEntity)[] {
    return entities.map((entity) => this.useTrackingAfterQuery(entity, updateState));
  }

  useTrackingBeforeQuery(entityOrPrimaryKey: TEntity | EntityInferPrimaryKey<TEntity> | NullableObject): TEntity | NullableObject {
    if (NullableObject.isEmpty(entityOrPrimaryKey)) return NullableObject;

    const entry = Entity.isExtends(entityOrPrimaryKey) ? this.tracker.getEntry(entityOrPrimaryKey) : this.tracker.getEntryByPrimaryKey(this.EntityType, entityOrPrimaryKey);
    if (NullableObject.isEmpty(entry)) return NullableObject;

    return entry.entity;
  }

  useTrackingManyBeforeQuery(entitiesOrPrimaryKeys: (TEntity | EntityInferPrimaryKey<TEntity> | NullableObject)[]): (TEntity | NullableObject)[] {
    return entitiesOrPrimaryKeys.map((entityOrPrimaryKey) => {
      if (NullableObject.isEmpty(entityOrPrimaryKey)) return NullableObject;

      const entry = Entity.isExtends(entityOrPrimaryKey) ? this.tracker.getEntry(entityOrPrimaryKey) : this.tracker.getEntryByPrimaryKey(this.EntityType, entityOrPrimaryKey);
      if (NullableObject.isEmpty(entry)) return NullableObject;

      return entry.entity;
    });
  }

  useTransaction(transactionFunction: DbTransactionExecuteFunction<TransactionPayload>): string {
    return this.dbContext.getDbSet(this.EntityType).addTransaction(transactionFunction);
  }

  // Query Repository

  async useGet(
    primaryKey: EntityInferPrimaryKey<TEntity>,
    callbackQuery: (primaryKey: EntityInferPrimaryKey<TEntity>) => Promise<TEntity | NullableObject>,
    { useTracking = true, updateState = false, force = false }: ReadRepositoryUseFindPrimaryKeyOptions,
  ): Promise<TEntity | NullableObject> {
    const trackingEntity = useTracking ? this.useTrackingBeforeQuery(primaryKey) : NullableObject;
    if (NullableObject.isEmpty(trackingEntity) || force) {
      const queryEntity = await callbackQuery(primaryKey);
      return useTracking ? this.useTrackingAfterQuery(queryEntity, updateState) : queryEntity;
    }

    return trackingEntity;
  }

  async useGetMany(
    primaryKeys: EntityInferPrimaryKey<TEntity>[],
    callbackQuery: (primaryKeys: EntityInferPrimaryKey<TEntity>[]) => Promise<(TEntity | NullableObject)[]>,
    { useTracking = true, updateState = false, force = false }: ReadRepositoryUseFindPrimaryKeyOptions,
  ): Promise<(TEntity | NullableObject)[]> {
    const trackingEntities = useTracking ? <TEntity[]>this.useTrackingManyBeforeQuery(primaryKeys).filter((m) => NullableObject.hasValue(m)) : [];

    // Ключи, которые нужно загрузить
    const needToQueryPK = <EntityInferPrimaryKey<TEntity>[]>primaryKeys
      .map((primaryKey) => {
        // Если принудительно, тогда загружаем PrimaryKey
        if (force) return primaryKey;
        // Если уже такой ключ уже трекается, значит пустое значение
        if (trackingEntities.find((m) => m.primaryKey.isEquals(primaryKey))) return NullableObject;
        return primaryKey;
      })
      .filter((m) => NullableObject.hasValue(m));

    // Загруженные сущности по запросу
    const queryEntities = needToQueryPK.length > 0 || force ? await callbackQuery(needToQueryPK) : [];
    const trackingQueryEntities = useTracking ? this.useTrackingManyAfterQuery(queryEntities, updateState) : queryEntities;

    return primaryKeys.map((primaryKey) => {
      const needToQueryPrimaryKeyIndex = needToQueryPK.findIndex((m) => m.isEquals(primaryKey));
      if (needToQueryPrimaryKeyIndex === -1) {
        // Если ключ не требовалось загружать, ищем сущность, которая уже трекалась, либо возвращаем Nullable
        const trackedBefore = trackingEntities.find((m) => m.primaryKey.isEquals(primaryKey));
        if (NullableObject.isEmpty(trackedBefore)) return NullableObject;
        return trackedBefore;
      }

      // Если данный ключ требовалось загружать, тогда возвращает значение из загруженных. Если значения нет, тогда Nullable
      const trackingQueryEntity = trackingQueryEntities.find((m) => (NullableObject.isEmpty(m) ? false : m.primaryKey.isEquals(primaryKey)));
      if (NullableObject.isEmpty(trackingQueryEntity)) return NullableObject;
      return trackingQueryEntity;
    });
  }

  async useFetch(
    entity: TEntity,
    callbackQuery: (primaryKey: EntityInferPrimaryKey<TEntity>) => Promise<TEntity | NullableObject>,
    { useTracking = false, updateState = false, force = true }: ReadRepositoryUseFetchOptions,
  ): Promise<TEntity | NullableObject> {
    return this.useGet(<EntityInferPrimaryKey<TEntity>>entity.primaryKey, callbackQuery, { useTracking, updateState, force });
  }

  async useFetchMany(
    entities: TEntity[],
    callbackQuery: (primaryKeys: EntityInferPrimaryKey<TEntity>[]) => Promise<(TEntity | NullableObject)[]>,
    { useTracking = false, updateState = false, force = true }: ReadRepositoryUseFetchOptions,
  ): Promise<(TEntity | NullableObject)[]> {
    return this.useGetMany(
      entities.map((m) => <EntityInferPrimaryKey<TEntity>>m.primaryKey),
      callbackQuery,
      { useTracking, updateState, force },
    );
  }

  useFirst(callbackQuery: () => Promise<NullableObject>, options: ReadRepositoryUseFindOptions): Promise<NullableObject>;
  useFirst(callbackQuery: () => Promise<TEntity>, options: ReadRepositoryUseFindOptions): Promise<TEntity>;
  useFirst(callbackQuery: () => Promise<NullableObject | TEntity>, options: ReadRepositoryUseFindOptions): Promise<NullableObject | TEntity>;
  async useFirst(callbackQuery: () => Promise<NullableObject | TEntity>, { useTracking, updateState }: ReadRepositoryUseFindOptions): Promise<NullableObject | TEntity> {
    const queryEntity = await callbackQuery();
    return useTracking ? this.useTrackingAfterQuery(queryEntity, updateState) : queryEntity;
  }

  async useFindMany(callbackQuery: () => Promise<TEntity[]>, options: ReadRepositoryUseFindOptions): Promise<TEntity[]> {
    const items = await this.useFindManyWithNullable(callbackQuery, options);
    const notNullable = items.filter((m) => NullableObject.hasValue(m)) as TEntity[];

    return notNullable;
  }

  async useFindManyWithNullable(
    callbackQuery: () => Promise<(NullableObject | TEntity)[]>,
    { useTracking = true, updateState = false }: ReadRepositoryUseFindOptions,
  ): Promise<(NullableObject | TEntity)[]> {
    // Загруженные сущности по запросу
    const queryEntities = await callbackQuery();
    const trackingQueryEntities = useTracking ? this.useTrackingManyAfterQuery(queryEntities, updateState) : queryEntities;

    return queryEntities.map((queryEntity) => {
      if (NullableObject.isEmpty(queryEntity)) return NullableObject;

      // Если данный ключ требовалось загружать, тогда возвращает значение из загруженных. Если значения нет, тогда Nullable
      const trackingQueryEntity = trackingQueryEntities.find((m) => (NullableObject.isEmpty(m) ? false : m.isEquals(queryEntity)));
      if (NullableObject.isEmpty(trackingQueryEntity)) return NullableObject;
      return trackingQueryEntity;
    });
  }

  // Write

  useAddRange(entities: TEntity[], callbackAdd: (payload: TransactionPayload, entities: TEntity[]) => Promise<(TEntity | NullableObject)[]>): void {
    if (entities.length <= 0) return void 0;

    this.tracker.addRange(entities);

    return void this.useTransaction(async (payload) => {
      const {
        transactionTriggers: { onFail },
      } = payload;

      const trackingEntriesAdded = this.tracker.findRange(entities).filter((m) => m.status === 'added');
      if (trackingEntriesAdded.length <= 0) return void 0;

      const prevSnapshots = trackingEntriesAdded.map((entry) => entry.getCurrentSnapshot());
      const entitiesNext = await callbackAdd(payload, entities);

      for (const index in trackingEntriesAdded) {
        const trackingEntry = trackingEntriesAdded[index];
        const entityNext = entitiesNext[index];
        if (NullableObject.hasValue(entityNext)) {
          this.tracker.apply(trackingEntry, entityNext);
        }
      }

      onFail.addAction(async () => {
        for (const index in trackingEntriesAdded) {
          const trackingEntry = trackingEntriesAdded[index];
          const prevSnapshot = prevSnapshots[index];
          if (!prevSnapshot) {
            console.log('WARNING! Not found prev snapshot for', trackingEntry);
            continue;
          }
          this.tracker.revert(trackingEntry, prevSnapshot);
        }
      });
    });
  }

  useUpdateRange(entities: TEntity[], callbackUpdate: (payload: TransactionPayload, entities: TEntity[]) => Promise<(TEntity | NullableObject)[]>): void {
    if (entities.length <= 0) return void 0;

    const trackingEntries = this.tracker.updateRange(entities);

    return void this.useTransaction(async (payload) => {
      const {
        transactionTriggers: { onFail },
      } = payload;

      const trackingEntriesModified = trackingEntries.filter((m) => m.status === 'modified');
      if (trackingEntriesModified.length <= 0) return void 0;

      const prevSnapshots = trackingEntriesModified.map((entry) => entry.getCurrentSnapshot());
      const entitiesNext = await callbackUpdate(payload, entities);

      for (const index in trackingEntriesModified) {
        const trackingEntry = trackingEntriesModified[index];
        const entityNext = entitiesNext[index];
        if (NullableObject.hasValue(entityNext)) {
          this.tracker.apply(trackingEntry, entityNext);
        }
      }

      onFail.addAction(async () => {
        for (const index in trackingEntriesModified) {
          const trackingEntry = trackingEntriesModified[index];
          const prevSnapshot = prevSnapshots[index];
          if (!prevSnapshot) {
            console.log('WARNING! Not found prev snapshot for', trackingEntry);
            continue;
          }
          this.tracker.revert(trackingEntry, prevSnapshot);
        }
      });
    });
  }

  useRemoveRange(
    entitiesOrPrimaryKeys: (TEntity | EntityInferPrimaryKey<TEntity>)[],
    callbackRemove: (payload: TransactionPayload, primaryKeys: EntityInferPrimaryKey<TEntity>[]) => Promise<void | void[]>,
  ): void {
    const entiries = <IDbEntityEntry<TEntity>[]>entitiesOrPrimaryKeys
      .map((entityOrPrimaryKey) => {
        if (Entity.isExtends(entityOrPrimaryKey)) return this.tracker.getEntry(entityOrPrimaryKey);
        return this.tracker.getEntryByPrimaryKey(this.EntityType, entityOrPrimaryKey);
      })
      .filter((m) => NullableObject.hasValue(m));

    const entities = entiries.map((m) => m.entity);
    if (entities.length <= 0) return void 0;

    const trackingEntries = this.tracker.removeRange(entities);

    return void this.useTransaction(async (payload) => {
      const {
        transactionTriggers: { onFail: onFailed },
      } = payload;

      const trackingEntriesDeleted = trackingEntries.filter((m) => m.status === 'deleted');
      if (trackingEntriesDeleted.length <= 0) return void 0;

      const prevSnapshots = trackingEntriesDeleted.map((entry) => entry.getCurrentSnapshot());
      const trackingPrimaryKeysDeleted = <EntityInferPrimaryKey<TEntity>[]>trackingEntriesDeleted.map((m) => m.entity.primaryKey);

      await callbackRemove(payload, trackingPrimaryKeysDeleted);

      onFailed.addAction(async () => {
        for (const index in trackingEntriesDeleted) {
          const trackingEntry = trackingEntriesDeleted[index];
          const snapshot = prevSnapshots[index];
          if (!snapshot) {
            console.log('WARNING! Not found prev snapshot for', trackingEntry.entity);
            continue;
          }
          trackingEntry.revertBySnapshot(snapshot);
        }
      });
    });
  }
}
