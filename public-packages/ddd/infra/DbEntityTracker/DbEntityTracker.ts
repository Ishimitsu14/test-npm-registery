import LINQ from '@berish/linq';

import { NullableObject } from '../../core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '../../domain';
import { DbEntityEntry } from './DbEntityEntry';
import { DbEntitySetTracker } from './DbEntitySetTracker';
import { DbEntityEntrySnapshot, IDbEntityEntry } from './IDbEntityEntry';
import { IDbEntitySetTracker } from './IDbEntitySetTracker';
import { IDbEntityTracker } from './IDbEntityTracker';

/**
 * 1. Если в трекер добавляется сущность с другой ссылкой но с тем же primaryKey, тогда exception
 * 2. Из запросов мы получаем сущности и всегда обновляем значения для ССЫЛКИ (apply метод принимает новую сущность и обновляет сущность из трекера) ***
 * 3. Entry возвращает запись о сущности, если ее нет, тогда добавляем со статусом detached, в следующий раз вернем его
 * 4. В Local возвращается только объекты, которые имеют статус Added, Unchanged, Modified
 */

export class DbEntityTracker implements IDbEntityTracker {
  private _entityTypeToSetTrackerMap: Map<EntityConstructor<Entity>, IDbEntitySetTracker<Entity>> = new Map();
  private _getSetTracker: <TEntity extends Entity>(entityType: EntityConstructor<TEntity>) => DbEntitySetTracker<TEntity>;

  constructor(getSetTracker: <TEntity extends Entity>(entityType: EntityConstructor<TEntity>) => DbEntitySetTracker<TEntity>) {
    this._getSetTracker = getSetTracker;
  }

  trackers(): readonly IDbEntitySetTracker<Entity>[] {
    return [...this._entityTypeToSetTrackerMap.values()];
  }

  set<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): DbEntitySetTracker<TEntity> {
    if (!this._entityTypeToSetTrackerMap.has(entityType)) {
      this._entityTypeToSetTrackerMap.set(entityType, this._getSetTracker(entityType));
    }
    return this._entityTypeToSetTrackerMap.get(entityType) as DbEntitySetTracker<TEntity>;
  }

  entries(): readonly DbEntityEntry<Entity>[];
  entries<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): readonly IDbEntityEntry<TEntity>[];
  entries<TEntity extends Entity>(entityType?: EntityConstructor<TEntity>): readonly IDbEntityEntry<TEntity | Entity>[] {
    if (!NullableObject.isEmpty(entityType)) return this.set(entityType).entries();
    return this.concatEntriesAndOrderByAscending(this.trackers().map((m) => m.entries()));
  }

  local(): readonly IDbEntityEntry<Entity>[];
  local<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): readonly IDbEntityEntry<TEntity>[];
  local<TEntity extends Entity>(entityType?: EntityConstructor<TEntity>): readonly IDbEntityEntry<TEntity | Entity>[] {
    if (!NullableObject.isEmpty(entityType)) return this.set(entityType).local();
    return this.concatEntriesAndOrderByAscending(this.trackers().map((m) => m.local()));
  }

  clear(): IDbEntityEntry<Entity>[];
  clear<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): IDbEntityEntry<TEntity>[];
  clear<TEntity extends Entity>(entityType?: EntityConstructor<TEntity>): IDbEntityEntry<TEntity | Entity>[] {
    if (!NullableObject.isEmpty(entityType)) return this.set(entityType).clear();
    return this.concatEntriesAndOrderByAscending(this.trackers().map((m) => m.clear()));
  }

  dispose(): IDbEntityEntry<Entity>[];
  dispose<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): IDbEntityEntry<TEntity>[];
  dispose<TEntity extends Entity>(entityType?: EntityConstructor<TEntity>): IDbEntityEntry<TEntity | Entity>[] {
    if (!NullableObject.isEmpty(entityType)) return this.set(entityType).dispose();
    return this.concatEntriesAndOrderByAscending(this.trackers().map((m) => m.dispose()));
  }

  getEntry<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).getEntry(entity);
  }

  getEntryByPrimaryKey<TEntity extends Entity>(entityType: EntityConstructor<TEntity>, primaryKey: EntityInferPrimaryKey<TEntity>): IDbEntityEntry<TEntity> | NullableObject {
    return this.set(entityType).getEntryByPrimaryKey(primaryKey);
  }

  apply<TEntity extends Entity>(entry: DbEntityEntry<TEntity>, entity: TEntity): IDbEntityEntry<TEntity> {
    return this.set(entry.entityType).apply(entry, entity);
  }
  revert<TEntity extends Entity>(entry: DbEntityEntry<TEntity>, snapshot: DbEntityEntrySnapshot<TEntity>): DbEntityEntry<TEntity> {
    return this.set(entry.entityType).revert(entry, snapshot);
  }
  attach<TEntity extends Entity>(entity: TEntity): DbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).attach(entity);
  }
  attachRange<TEntity extends Entity>(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => {
      const type = Entity.getTypeOfInstance(entity);
      return this.set(type).attach(entity);
    });
  }
  detach<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).detach(entity);
  }
  detachRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[] {
    return entities.map((entity) => {
      const type = Entity.getTypeOfInstance(entity);
      return this.set(type).detach(entity);
    });
  }
  add<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).add(entity);
  }
  addRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[] {
    return entities.map((entity) => {
      const type = Entity.getTypeOfInstance(entity);
      return this.set(type).add(entity);
    });
  }
  update<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).update(entity);
  }
  updateRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[] {
    return entities.map((entity) => {
      const type = Entity.getTypeOfInstance(entity);
      return this.set(type).update(entity);
    });
  }
  remove<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).remove(entity);
  }

  removeRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[] {
    return entities.map((entity) => {
      const type = Entity.getTypeOfInstance(entity);
      return this.set(type).remove(entity);
    });
  }

  find<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity> {
    const type = Entity.getTypeOfInstance(entity);
    return this.set(type).find(entity);
  }

  findRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[] {
    return entities.map((entity) => {
      const type = Entity.getTypeOfInstance(entity);
      return this.set(type).find(entity);
    });
  }

  private concatEntriesAndOrderByAscending<TEntity extends Entity>(entries: (readonly IDbEntityEntry<TEntity>[])[]): IDbEntityEntry<TEntity>[] {
    return LINQ.from([...entries])
      .selectMany((m) => [...m])
      .orderByAscending((m) => +m.statusTimestamp)
      .toArray();
  }
}
