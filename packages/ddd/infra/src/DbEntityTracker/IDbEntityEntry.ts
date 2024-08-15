import { State } from '@ddd/core';
import { Entity, EntityConstructor } from '@ddd/domain';

export type DbEntityStatus = 'unchanged' | 'added' | 'modified' | 'deleted' | 'detached';

export type DbEntityEntrySnapshot<TEntity extends Entity> = {
  entry: symbol;
  state: State<TEntity>;
  status: DbEntityStatus;
  statusTimestamp: Date;
};

export interface IDbEntityEntry<TEntity extends Entity> {
  /** Статус отслеживаемой записи */
  get status(): DbEntityStatus;
  /** Возвращает экземпляр сущности */
  get entity(): TEntity;

  get entityType(): EntityConstructor<TEntity>;

  /** Дата смены статуса */
  get statusTimestamp(): Date;

  /** Указывает, имеет ли сущность установленный ключ */
  hasPrimaryKey(): boolean;
  /** Обновление статуса отслеживаемой записи */
  updateStatus(status: DbEntityStatus): void;

  /** Получает снимок значений сущности */
  getState(): State<TEntity>;
  /** Обновляет сущность согласно переданной сущности или снимку сущности. Ссылка на сущность остается прежней */
  updateState(entity: TEntity | State<TEntity>): void;

  /** Возвращает снимок текущей записи, чтобы в любой момент к ней можно было вернуться */
  getCurrentSnapshot(): DbEntityEntrySnapshot<TEntity>;
  /** Возвращает состояние entry к предыдущему */
  revertBySnapshot(snapshot: DbEntityEntrySnapshot<TEntity>): void;
}
