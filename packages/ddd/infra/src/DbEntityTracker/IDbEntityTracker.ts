import { NullableObject } from '@ddd/core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '@ddd/domain';

import { DbEntityEntrySnapshot, IDbEntityEntry } from './IDbEntityEntry';
import { IDbEntitySetTracker } from './IDbEntitySetTracker';

export interface IDbEntityTracker {
  trackers(): readonly IDbEntitySetTracker<Entity>[];
  set<TEntity extends Entity>(entityClass: EntityConstructor<TEntity>): IDbEntitySetTracker<TEntity>;

  /** Возвращает абсолютно все записи, которые находятся в трекере (в том числе detached, если конечно сущность хоть раз связывалась с трекером) */
  entries(): readonly IDbEntityEntry<Entity>[];
  entries<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): readonly IDbEntityEntry<TEntity>[];
  /** Отображает список записей, которые будут при утверждении изменений в БД. Возвращает список записей о всех сущностях, которые добавлены, измененные и без изменений */
  local(): readonly IDbEntityEntry<Entity>[];
  local<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): readonly IDbEntityEntry<TEntity>[];
  /** Задает всем записем в контексте статус detached и возвращает их */
  clear(): IDbEntityEntry<Entity>[];
  clear<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): IDbEntityEntry<TEntity>[];
  /** Очищает полностью записи слежения и возвращает их */
  dispose(): IDbEntityEntry<Entity>[];
  dispose<TEntity extends Entity>(entityType: EntityConstructor<TEntity>): IDbEntityEntry<TEntity>[];

  /** Возращает запись сущности. Если запись не найдена, тогда статус detached */
  getEntry<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;

  /** Возвращает запись сущности по ключу. Если запись не найдена, возвращает NullableObject */
  getEntryByPrimaryKey<TEntity extends Entity>(entityType: EntityConstructor<TEntity>, primaryKey: EntityInferPrimaryKey<TEntity>): IDbEntityEntry<TEntity> | NullableObject;

  /** Применяет изменения к записи и меняет ее статус на Unchanged */
  apply<TEntity extends Entity>(entry: IDbEntityEntry<TEntity>, entity: TEntity): IDbEntityEntry<TEntity>;
  /** Сбрасывает запись к предыдущему состоянию */
  revert<TEntity extends Entity>(entry: IDbEntityEntry<TEntity>, snapshot: DbEntityEntrySnapshot<TEntity>): IDbEntityEntry<TEntity>;

  /** Начинает отслеживание заданной сущности и записи, доступных из данной сущности, используя Unchanged состояние по умолчанию. */
  attach<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `attach` ко всем переданным сущностям */
  attachRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Отвязывает сущность неважно в каком состояни она находится. Возвращается статус detach */
  detach<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `detach` ко всем переданным сущностям */
  detachRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Начинает отслеживание заданной сущности и любых других доступных сущностей, которые еще не отслеживаются, в Added состоянии. */
  add<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `add` ко всем переданным сущностям */
  addRange<TEntity extends Entity>(entity: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Начинает отслеживание заданной сущности и ее записи в состоянии modified. */
  update<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `update` ко всем переданным сущностям */
  updateRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Начинает отслеживание заданной сущности в состоянии deleted. */
  remove<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `remove` ко всем переданным сущностям */
  removeRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Если сущность не отслеживалась, меняет статус на unchanged */
  find<TEntity extends Entity>(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `find` ко всем переданным сущностям */
  findRange<TEntity extends Entity>(entities: TEntity[]): IDbEntityEntry<TEntity>[];
}
