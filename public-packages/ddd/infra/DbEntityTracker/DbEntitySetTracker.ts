import LINQ from '@berish/linq';

import { NullableObject } from '../../core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '../../domain';
import { DbEntityEntry } from './DbEntityEntry';
import { DbEntityEntrySnapshot } from './IDbEntityEntry';
import { IDbEntitySetTracker } from './IDbEntitySetTracker';

/**
 * 1. Если в трекер добавляется сущность с другой ссылкой но с тем же primaryKey, тогда exception
 * 2. Из запросов мы получаем сущности и всегда обновляем значения для ССЫЛКИ (apply метод принимает новую сущность и обновляет сущность из трекера) ***
 * 3. Entry возвращает запись о сущности, если ее нет, тогда добавляем со статусом detached, в следующий раз вернем его
 * 4. В Local возвращается только объекты, которые имеют статус Added, Unchanged, Modified
 */

export class DbEntitySetTracker<TEntity extends Entity> implements IDbEntitySetTracker<TEntity> {
  private _entityType: EntityConstructor<TEntity>;
  private _entries: DbEntityEntry<TEntity>[] = [];

  constructor(entityType: EntityConstructor<TEntity>) {
    this._entityType = entityType;
  }

  getEntityType(): EntityConstructor<TEntity> {
    return this._entityType;
  }

  entries(): readonly DbEntityEntry<TEntity>[] {
    return LINQ.from(this._entries)
      .orderByAscending((m) => +m.statusTimestamp)
      .toArray();
  }

  local(): readonly DbEntityEntry<TEntity>[] {
    return this.entries().filter((m) => m.status === 'added' || m.status === 'modified' || m.status === 'unchanged');
  }

  getEntry(entity: TEntity): DbEntityEntry<TEntity> {
    let entityEntry = this._entries.find((m) => m.entity.isEquals(entity));
    if (!entityEntry) {
      entityEntry = new DbEntityEntry(entity, 'detached');
      this._entries.push(entityEntry);
    }

    return entityEntry;
  }

  getEntryByPrimaryKey(primaryKey: EntityInferPrimaryKey<TEntity>): NullableObject | DbEntityEntry<TEntity> {
    const entry = this._entries.find((m) => m.entity.primaryKey.isEquals(primaryKey));
    if (!entry) return NullableObject;

    return entry;
  }

  clear(): DbEntityEntry<TEntity>[] {
    const entities = this._entries.map((entry) => entry.entity);
    return this.detachRange(entities);
  }

  dispose(): DbEntityEntry<TEntity>[] {
    const prevEntries = [...this._entries];
    this._entries = [];
    return prevEntries;
  }

  apply(entry: DbEntityEntry<TEntity>, entity: TEntity): DbEntityEntry<TEntity> {
    entry.updateState(entity);
    entry.updateStatus('unchanged');
    return entry;
  }

  revert(entry: DbEntityEntry<TEntity>, snapshot: DbEntityEntrySnapshot<TEntity>): DbEntityEntry<TEntity> {
    entry.revertBySnapshot(snapshot);
    return entry;
  }

  attach(entity: TEntity): DbEntityEntry<TEntity> {
    const entry = this.getEntry(entity);
    if (entry.status === 'detached') {
      if (entry.hasPrimaryKey()) {
        entry.updateStatus('unchanged');
      } else {
        entry.updateStatus('added');
      }
    }
    return entry;
  }

  attachRange(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => this.attach(entity));
  }

  detach(entity: TEntity): DbEntityEntry<TEntity> {
    const entry = this.getEntry(entity);
    if (entry.status !== 'detached') {
      entry.updateStatus('detached');
    }
    return entry;
  }

  detachRange(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => this.detach(entity));
  }

  add(entity: TEntity): DbEntityEntry<TEntity> {
    const entry = this.getEntry(entity);
    entry.updateStatus('added');

    return entry;
  }

  addRange(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => this.add(entity));
  }

  update(entity: TEntity): DbEntityEntry<TEntity> {
    const entry = this.getEntry(entity);
    if (entry.hasPrimaryKey()) {
      entry.updateStatus('modified');
    } else {
      entry.updateStatus('added');
    }

    return entry;
  }

  updateRange(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => this.update(entity));
  }

  remove(entity: TEntity): DbEntityEntry<TEntity> {
    const entry = this.getEntry(entity);
    if (entry.status === 'added') {
      entry.updateStatus('detached');
    } else {
      entry.updateStatus('deleted');
    }
    return entry;
  }

  removeRange(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => this.remove(entity));
  }

  find(entity: TEntity): DbEntityEntry<TEntity> {
    const entry = this.getEntry(entity);
    if (entry.status === 'detached') {
      entry.updateStatus('unchanged');
    }
    return entry;
  }

  findRange(entities: TEntity[]): DbEntityEntry<TEntity>[] {
    return entities.map((entity) => this.find(entity));
  }

  //   attach(entity: TEntity | NullableObject): TEntity | NullableObject {
  //     if (NullableObject.isEmpty(entity)) return NullableObject;
  //     if (!Entity.isExtends(entity)) return NullableObject;

  //     const cachedEntity = this.getAttached(entity);
  //     if (NullableObject.hasValue(cachedEntity)) this.detach(cachedEntity);

  //     this._attachList.push(entity);
  //     return entity;
  //   }

  //   // ok
  //   attachMany(entities: (TEntity | NullableObject)[]): (TEntity | NullableObject)[] {
  //     return entities.map((entity) => this.attach(entity));
  //   }

  //   // ok
  //   isAttached(entityOrPrimaryKey: TEntity | EntityPrimaryKey<TEntity> | NullableObject): boolean {
  //     const attachedEntity = this.getAttached(entityOrPrimaryKey);
  //     return NullableObject.hasValue(attachedEntity);
  //   }

  //   // ok
  //   isAttachedMany(entitiesOrPrimaryKeys: (TEntity | EntityPrimaryKey<TEntity> | NullableObject)[]): boolean[] {
  //     return entitiesOrPrimaryKeys.map((entity) => this.isAttached(entity));
  //   }

  //   // ok
  //   getAttached(entityOrPrimaryKey: TEntity | EntityPrimaryKey<TEntity> | NullableObject): TEntity | NullableObject {
  //     if (NullableObject.isEmpty(entityOrPrimaryKey)) return NullableObject;
  //     if (!Entity.isExtends(entityOrPrimaryKey) && !Entity.isPrimaryKey(entityOrPrimaryKey)) return NullableObject;

  //     if (Entity.isExtends(entityOrPrimaryKey)) return this._attachList.find((attachedEntity) => Entity.isEquals(entityOrPrimaryKey, attachedEntity)) || NullableObject;

  //     return this._attachList.find((attachedEntity) => Entity.isEqualsPrimaryKey(entityOrPrimaryKey, <EntityPrimaryKey<TEntity>>attachedEntity.primaryKey)) || NullableObject;
  //   }

  //   // ok
  //   getAttachedMany(entitiesOrPrimaryKeys: (TEntity | EntityPrimaryKey<TEntity> | NullableObject)[]): (TEntity | NullableObject)[] {
  //     return entitiesOrPrimaryKeys.map((entity) => this.getAttached(entity));
  //   }

  //   detach(entityOrPrimaryKey: TEntity | EntityPrimaryKey<TEntity> | NullableObject): TEntity | NullableObject {
  //     const attachedEntity = this.getAttached(entityOrPrimaryKey);
  //     if (NullableObject.isEmpty(attachedEntity)) return NullableObject;

  //     // Проверка через !==, так как attachedEntity имеет прямую ссылку на объект в списке
  //     this._attachList = this._attachList.filter((m) => m !== attachedEntity);
  //     return attachedEntity;
  //   }

  //   detachMany(entitiesOrPrimaryKeys: (TEntity | EntityPrimaryKey<TEntity> | NullableObject)[]): (TEntity | NullableObject)[] {
  //     return entitiesOrPrimaryKeys.map((entity) => this.detach(entity));
  //   }

  //   listAttached(): TEntity[] {
  //     return this._attachList;
  //   }

  //   cleanAttached(): void {
  //     this._attachList = [];
  //   }
}
