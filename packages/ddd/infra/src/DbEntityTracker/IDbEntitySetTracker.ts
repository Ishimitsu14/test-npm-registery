import { NullableObject } from '@ddd/core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '@ddd/domain';

import { DbEntityEntrySnapshot, IDbEntityEntry } from './IDbEntityEntry';

export interface IDbEntitySetTracker<TEntity extends Entity> {
  /** Метатип сущности (класс) */
  getEntityType(): EntityConstructor<TEntity>;
  /** Возвращает абсолютно все записи, которые находятся в трекере (в том числе detached, если конечно сущность хоть раз связывалась с трекером) */
  entries(): readonly IDbEntityEntry<TEntity>[];
  /** Отображает список записей, которые будут при утверждении изменений в БД. Возвращает список записей о всех сущностях, которые добавлены, измененные и без изменений */
  local(): readonly IDbEntityEntry<TEntity>[];
  /** Возращает запись сущности. Если запись не найдена, тогда статус detached */
  getEntry(entity: TEntity): IDbEntityEntry<TEntity>;

  /** Возвращает запись сущности по ключу. Если запись не найдена, возвращает NullableObject */
  getEntryByPrimaryKey(primaryKey: EntityInferPrimaryKey<TEntity>): IDbEntityEntry<TEntity> | NullableObject;

  /** Задает всем записем в контексте статус detached и возвращает их */
  clear(): IDbEntityEntry<TEntity>[];
  /** Очищает полностью записи слежения и возвращает их */
  dispose(): IDbEntityEntry<TEntity>[];
  /** Применяет изменения к записи и меняет ее статус на Unchanged */
  apply(entry: IDbEntityEntry<TEntity>, entity: TEntity): IDbEntityEntry<TEntity>;
  /** Сбрасывает запись к предыдущему состоянию */
  revert(entry: IDbEntityEntry<TEntity>, snapshot: DbEntityEntrySnapshot<TEntity>): IDbEntityEntry<TEntity>;

  /** Начинает отслеживание заданной сущности и записи, доступных из данной сущности, используя Unchanged состояние по умолчанию. */
  attach(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `attach` ко всем переданным сущностям */
  attachRange(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Отвязывает сущность неважно в каком состояни она находится. Возвращается статус detach */
  detach(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `detach` ко всем переданным сущностям */
  detachRange(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Начинает отслеживание заданной сущности и любых других доступных сущностей, которые еще не отслеживаются, в Added состоянии. */
  add(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `add` ко всем переданным сущностям */
  addRange(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Начинает отслеживание заданной сущности и ее записи в состоянии modified. */
  update(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `update` ко всем переданным сущностям */
  updateRange(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Начинает отслеживание заданной сущности в состоянии deleted. */
  remove(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `remove` ко всем переданным сущностям */
  removeRange(entities: TEntity[]): IDbEntityEntry<TEntity>[];
  /** Если сущность не отслеживалась, меняет статус на unchanged */
  find(entity: TEntity): IDbEntityEntry<TEntity>;
  /** Применяет `find` ко всем переданным сущностям */
  findRange(entities: TEntity[]): IDbEntityEntry<TEntity>[];
}
