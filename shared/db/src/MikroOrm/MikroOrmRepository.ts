import { ConstructorType, Nullable, NullableObject } from '@ddd/core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '@ddd/domain';
import { createSnapshotFromEntity, createSnapshotFromPrimaryKey, ISnapshotEntity } from '@ddd/infra';
import { Query, QueryRepository, QueryResolver, WhereInPKSpecification } from '@ddd/specifications';
import { EntityMetadata } from '@mikro-orm/core';
import { PostgreSqlDriver, SqlEntityManager, SqlEntityRepository } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

import { MikroOrmDbContext } from './Connection';
import { MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN, MIKRO_ORM_INJECT_TOKEN } from './InjectTokens';
import { IMikroOrmRepository, MikroOrmDbTransactionExecutePayload } from './Interfaces';
import { MikroOrmQueryResolver } from './MikroOrmQueryResolver';

export abstract class MikroOrmRepository<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>>
  extends QueryRepository<TEntity, MikroOrmDbTransactionExecutePayload>
  implements IMikroOrmRepository<TEntity, TSnapshot>
{
  @Inject(MIKRO_ORM_INJECT_TOKEN)
  public readonly orm: MIKRO_ORM_INJECT_TOKEN;

  @Inject(MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN)
  public readonly em: MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN;

  @Inject(MikroOrmDbContext)
  public readonly dbContext: MikroOrmDbContext;

  @Inject(QueryResolver)
  private readonly queryResolver: MikroOrmQueryResolver;

  abstract get EntityType(): EntityConstructor<TEntity>;
  abstract get SnapshotType(): ConstructorType<TSnapshot>;

  getMetadata(): EntityMetadata<TSnapshot> {
    return this.orm.getMetadata(this.SnapshotType);
  }

  // Base methods

  addMany(entities: TEntity[]): void {
    return this.useAddRange(entities, (command, entities) => this._insert(command, entities));
  }

  updateMany(entities: TEntity[]): void {
    return this.useUpdateRange(entities, (command, entities) => this._update(command, entities));
  }

  upsertMany(entities: TEntity[]): void {
    return this.useUpdateRange(entities, (command, entities) => this._update(command, entities));
  }

  removeMany(entities: TEntity[]): void {
    return this.useRemoveRange(entities, (command, primaryKeys) => this._remove(command, primaryKeys));
  }

  removeManyByPKs(primaryKeys: EntityInferPrimaryKey<TEntity>[]): void {
    return this.useRemoveRange(primaryKeys, (command, primaryKeys) => this._remove(command, primaryKeys));
  }

  fetchMany(entities: TEntity[]): Promise<(TEntity | NullableObject)[]> {
    return this.useFetchMany(entities, (keys) => this._getMany(keys), {});
  }

  getMany(primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<(TEntity | NullableObject)[]> {
    return this.useGetMany(primaryKeys, (keys) => this._getMany(keys), { force: true });
  }

  protected async internalFind(query: Query<TEntity>): Promise<[items: TEntity[], count: number]> {
    const queryBuilder = this.createEmptyQueryBuilder(this.em);
    const queryPredicate = await this.queryResolver.resolveQuery(query, this);
    const predicatedQueryBuilder = queryPredicate(queryBuilder);

    const [snapshots, count] = await predicatedQueryBuilder.getResultAndCount();
    const items = snapshots
      .map((snapshot) => {
        if (NullableObject.isEmpty(snapshot)) return NullableObject;

        return snapshot.toDomain();
      })
      .filter(NullableObject.hasValue);

    return [items, count];
  }

  protected async internalFirst(query: Query<TEntity>): Promise<Nullable<TEntity>> {
    const queryBuilder = this.createEmptyQueryBuilder(this.em);
    const queryPredicate = await this.queryResolver.resolveQuery(query, this);
    const predicatedQueryBuilder = queryPredicate(queryBuilder);

    const snapshot = await predicatedQueryBuilder.getSingleResult();
    if (NullableObject.isEmpty(snapshot)) return NullableObject;

    return snapshot.toDomain();
  }

  protected async internalCount(query: Query<TEntity>): Promise<number> {
    const queryBuilder = this.createEmptyQueryBuilder(this.em);
    const queryPredicate = await this.queryResolver.resolveQuery(query, this);
    const predicatedQueryBuilder = queryPredicate(queryBuilder);

    return predicatedQueryBuilder.getCount();
  }

  protected async internalRemove(query: Query<TEntity>, payload: MikroOrmDbTransactionExecutePayload): Promise<void> {
    const queryBuilder = this.createEmptyQueryBuilder(this.em);
    const queryPredicate = await this.queryResolver.resolveQuery(query, this);
    const predicatedQueryBuilder = queryPredicate(queryBuilder);

    await predicatedQueryBuilder.delete();
  }

  createSnapshotFromPK(primaryKey: EntityInferPrimaryKey<TEntity>): TSnapshot {
    return createSnapshotFromPrimaryKey(this.SnapshotType, primaryKey);
  }

  createSnapshotFromEntity(entity: TEntity): TSnapshot {
    return createSnapshotFromEntity(this.SnapshotType, entity);
  }

  protected async _getMany(primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<(TEntity | NullableObject)[]> {
    const queryBuilder = this.createEmptyQueryBuilder(this.em);
    const queryPredicate = await this.queryResolver.resolveQuery(Query.create().addSpecification(WhereInPKSpecification.create(primaryKeys)), this);
    const predicatedQueryBuilder = queryPredicate(queryBuilder);

    const snapshots = await predicatedQueryBuilder.getResultList();

    return snapshots.map((snapshot) => {
      if (NullableObject.isEmpty(snapshot)) return NullableObject;
      return snapshot.toDomain();
    });
  }

  protected async _insert({ manager }: MikroOrmDbTransactionExecutePayload, entities: TEntity[]): Promise<(TEntity | NullableObject)[]> {
    const snapshots = entities.map((entity) => this.createSnapshotFromEntity(entity));
    await manager.persistAndFlush(snapshots);

    return snapshots.map((snapshot) => snapshot.toDomain());
  }

  protected async _update({ manager }: MikroOrmDbTransactionExecutePayload, entities: TEntity[]): Promise<(TEntity | NullableObject)[]> {
    const snapshots = entities.map((entity) => this.createSnapshotFromEntity(entity));
    await manager.upsertMany(snapshots);

    return entities;
  }

  protected async _remove({ manager }: MikroOrmDbTransactionExecutePayload, primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<void | void[]> {
    const queryBuilder = this.createEmptyQueryBuilder(manager).delete();
    const queryPredicate = await this.queryResolver.resolveQuery(Query.create<TEntity>().addSpecification(WhereInPKSpecification.create(primaryKeys)), this);
    const predicatedQueryBuilder = queryPredicate(<any>queryBuilder);

    await predicatedQueryBuilder.execute();
  }

  createEmptyQueryBuilder(manager: SqlEntityManager<PostgreSqlDriver>) {
    const repository = this.internalGetRepository(manager);
    return repository.createQueryBuilder(this.EntityType.name);
  }

  // async wrapQuery(query: Query<TEntity>, usePageable: boolean = false) {
  //   const specQueryPredicate = this.queryResolver.resolveSpecification(query.specs, this);
  //   const sortableQueryPredicate = this.queryResolver.resolveSortable(query.sorts, this);
  //   const pageableWrapper = usePageable && this.wrapPageable(query.pageable);

  //   return this.wrapCombine([specQueryPredicate, sortableWrapper, pageableWrapper].filter(Boolean));
  // }

  private internalGetRepository(manager: SqlEntityManager<PostgreSqlDriver>) {
    return manager.getRepository(this.SnapshotType) as SqlEntityRepository<TSnapshot>;
  }
}
