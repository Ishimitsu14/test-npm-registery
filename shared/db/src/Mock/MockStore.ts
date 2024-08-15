import { NullableObject } from '@ddd/core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '@ddd/domain';
import cloneDeep from 'lodash.clonedeep';

export class MockStoreRegistry {
  private database = new Map<EntityConstructor<Entity>, MockStore<Entity>>();

  getStore<TEntity extends Entity>(entityTypeFunc: () => EntityConstructor<TEntity>): MockStore<TEntity> {
    const entityType = entityTypeFunc();

    if (!this.database.has(entityType)) {
      const store = new MockStore<TEntity>([]);
      this.database.set(entityType, store);
    }
    return this.database.get(entityType) as MockStore<TEntity>;
  }

  async transaction<T>(callback: (registry: MockStoreRegistry) => Promise<T>): Promise<T> {
    const registry = new MockStoreRegistry();
    registry.database = new Map();

    const types = this.database.keys();
    for (const type of types) {
      registry.database.set(type, this.database.get(type).clone());
    }

    const result = await callback(registry);
    // TODO Ошибка, разобраться, почему меняется старый стор, а не новый
    // this.database = registry.database;

    return result;
  }
}

export class MockStore<TEntity extends Entity> {
  private data: TEntity[];

  constructor(seed: TEntity[]) {
    this.data = seed;
  }

  get(pk: EntityInferPrimaryKey<TEntity>) {
    return this.data.find((m) => m.primaryKey.isEquals(pk)) || NullableObject;
  }

  getMany(pks: EntityInferPrimaryKey<TEntity>[]) {
    return pks.map((pk) => this.get(pk));
  }

  save(entity: TEntity) {
    const index = this.data.findIndex((m) => m.primaryKey.isEquals(entity.primaryKey));
    if (index === -1) {
      this.data.push(entity);
    } else {
      this.data.splice(index, 1, entity);
    }
  }

  remove(pk: EntityInferPrimaryKey<TEntity>) {
    this.data = this.data.filter((entity) => !entity.primaryKey.isEquals(pk));
  }

  getAll() {
    return this.data.slice();
  }

  clone() {
    return new MockStore(cloneDeep(this.data.slice()));
  }
}
