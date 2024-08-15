import { NullableObject } from '../../core';
import { Entity, EntityConstructor, EntityInferPrimaryKey } from '../../domain';
import { IDbContext } from '../DbContext';
import { IDbEntityTracker } from '../DbEntityTracker';
import { DbTransactionExecuteFunction, DbTransactionExecutePayload } from '../DbTransaction';

export interface IBaseRepository<TEntity extends Entity, DbTransactionPayloadCustom extends DbTransactionExecutePayload = DbTransactionExecutePayload> {
  get dbContext(): IDbContext<DbTransactionPayloadCustom>;
  get tracker(): IDbEntityTracker;
  get EntityType(): EntityConstructor<TEntity>;

  /**
   * Когда сделан запрос и значением является Entity, тогда начинаем отслеживать данную сущность через трекер.
   * Возвращает ссылку на сущности из трекера. Не обновляет данные в трекере
   * @param entity Сущность для трекинга
   * @param updateState Обновляет данные сущности в трекере (ссылка не меняется). Полезно для update/fetch операций
   */
  useTrackingAfterQuery(entity: TEntity | NullableObject, updateState?: boolean): TEntity | NullableObject;
  /**
   * Применяет `trackingAfterQuery` ко всем переданным ключам
   * @param entities Ключи сущностей
   */
  useTrackingManyAfterQuery(entities: (TEntity | NullableObject)[], updateState?: boolean): (TEntity | NullableObject)[];

  /**
   * Пытаемся получить сущность по ключу из трекера. Если в трекере есть сущность, возращает ее, иначе NullableObject
   * @param primaryKey Ключ сущности
   */
  useTrackingBeforeQuery(entityOrPrimaryKey: TEntity | EntityInferPrimaryKey<TEntity> | NullableObject): TEntity | NullableObject;
  /**
   * Применяет `trackingBeforeQuery` ко всем переданным ключам
   * @param primaryKeys Ключи сущностей
   */
  useTrackingManyBeforeQuery(entitiesOrPrimaryKeys: (TEntity | EntityInferPrimaryKey<TEntity> | NullableObject)[]): (TEntity | NullableObject)[];

  /**
   * Добавляет новую транзакцию в контекст
   * @param transactionFunction Функция исполнения транзакции
   */
  useTransaction(transactionFunction: DbTransactionExecuteFunction<DbTransactionPayloadCustom>): string;
}
