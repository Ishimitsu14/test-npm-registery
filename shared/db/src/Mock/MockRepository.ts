import { Nullable, NullableObject } from '@ddd/core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '@ddd/domain';
import { Query, QueryRepository, QueryResolver } from '@ddd/specifications';
import { Inject } from '@nestjs/common';

import { IMockRepository, MockDbTransactionExecutePayload } from './Interfaces';
import { MockDbContext } from './MockDbContext';
import { MockQueryResolver } from './MockQueryResolver';
import { MockStore, MockStoreRegistry } from './MockStore';
import { MockQueryPredicate } from './types';

export abstract class MockRepository<TEntity extends Entity> extends QueryRepository<TEntity, MockDbTransactionExecutePayload> implements IMockRepository<TEntity> {
  @Inject(MockDbContext)
  public readonly dbContext: MockDbContext;

  @Inject(MockStoreRegistry)
  private readonly mockStoreRegistry: MockStoreRegistry;

  @Inject(QueryResolver)
  private readonly queryResolver: MockQueryResolver;

  abstract get EntityType(): EntityConstructor<TEntity>;

  // Base methods

  addMany(entities: TEntity[]): void {
    return this.useAddRange(entities, (command, entities) => this._save(command, entities));
  }

  updateMany(entities: TEntity[]): void {
    return this.useUpdateRange(entities, (command, entities) => this._save(command, entities));
  }

  upsertMany(entities: TEntity[]): void {
    return this.useUpdateRange(entities, (command, entities) => this._save(command, entities));
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
    const [entities, count] = await this.internalCreateQueryBuilder(query);

    return [entities, count];
  }

  protected async internalFirst(query: Query<TEntity>): Promise<Nullable<TEntity>> {
    const [entities] = await this.internalCreateQueryBuilder(query);

    return NullableObject(entities[0]);
  }

  protected async internalCount(query: Query<TEntity>): Promise<number> {
    const [, total] = await this.internalCreateQueryBuilder(query);

    return total;
  }

  protected async internalRemove(query: Query<TEntity>, payload: MockDbTransactionExecutePayload): Promise<void> {
    const store = this.getMockStore(payload.registry);
    const [entities] = await this.internalCreateQueryBuilder(query);

    for (const entity of entities) {
      store.remove(<EntityInferPrimaryKey<TEntity>>entity.primaryKey);
    }
  }

  protected getMockStore(mockStoreRegistry?: MockStoreRegistry) {
    mockStoreRegistry = mockStoreRegistry ?? this.mockStoreRegistry;

    return this.mockStoreRegistry.getStore(() => this.EntityType);
  }

  protected async _getMany(primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<(TEntity | NullableObject)[]> {
    const entities = this.getMockStore().getMany(primaryKeys);
    return entities;
  }

  protected async _save({ registry }: MockDbTransactionExecutePayload, entities: TEntity[]): Promise<(TEntity | NullableObject)[]> {
    const store = this.getMockStore(registry);

    for (const entity of entities) {
      store.save(entity);
    }

    return entities;
  }

  protected async _remove({ registry }: MockDbTransactionExecutePayload, primaryKeys: EntityInferPrimaryKey<TEntity>[]): Promise<void | void[]> {
    const store = this.getMockStore(registry);
    for (const pk of primaryKeys) {
      store.remove(pk);
    }
  }

  createEmptyQueryPredicate(mockStore: MockStore<TEntity>): MockQueryPredicate<TEntity> {
    return () => mockStore.getAll();
  }

  public async internalCreateQueryBuilder(query: Query<TEntity>, mockStoreRegistry?: MockStoreRegistry): Promise<[entities: TEntity[], count: number]> {
    const mockStore = this.getMockStore(mockStoreRegistry);
    const specificationPredicate = await this.queryResolver.resolveSpecification(query.specs, this);
    const specifiedEntities = await specificationPredicate(mockStore.getAll());
    const count = specifiedEntities.length;

    const sortablePredicate = await this.queryResolver.resolveSortable(query.sorts, this);
    const pageablePredicate = await this.queryResolver.resolvePageable(query.pageable, this);
    const combinedPredicate = this.queryResolver.combinePredicates([sortablePredicate, pageablePredicate]);

    const entities = await combinedPredicate(specifiedEntities);

    return [entities, count];
  }
}
