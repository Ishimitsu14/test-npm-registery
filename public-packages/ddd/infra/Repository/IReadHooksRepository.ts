import { NullableObject } from '../../core';
import { Entity, EntityInferPrimaryKey } from '../../domain';

export type ReadRepositoryUseFindPrimaryKeyOptions = {
  /**
   * Включает механизм трекинга. Берет данные из трекера, а так же отслеживает все сущности.
   * Используется механизм трекинга при запросе кешированных (затреканных значений), а также заносит все новые данные туда.
   *
   * Если выключен, каждый раз возвращаются новые сущности. Данные так же не запрашиваются из трекинга.
   *
   * По-умолчанию `true`,
   */
  useTracking?: boolean;
  /**
   * Обновляет данные сущности в трекере (ссылка не меняется).
   *
   * Когда выключен, если данные есть в контексте, состояние не обновляется
   *
   * По-умолчанию `false`.
   */
  updateState?: boolean;
  /**
   * Делает принудительный запрос, даже если запись в трекере есть. Всегда делает запросы к БД.
   * Если выключен, делает запрос только недостающих изменений.
   *
   * По-умолчанию `false`
   */
  force?: boolean;
};

export type ReadRepositoryUseFetchOptions = {
  /**
   * Включает механизм трекинга. Берет данные из трекера, а так же отслеживает все сущности.
   * Используется механизм трекинга при запросе кешированных (затреканных значений), а также заносит все новые данные туда.
   *
   * Если выключен, каждый раз возвращаются новые сущности. Данные так же не запрашиваются из трекинга.
   *
   * По-умолчанию `false`,
   */
  useTracking?: boolean;
  /**
   * Обновляет данные сущности в трекере (ссылка не меняется).
   *
   * Когда выключен, если данные есть в контексте, состояние не обновляется
   *
   * По-умолчанию `false`.
   */
  updateState?: boolean;
  /**
   * Делает принудительный запрос, даже если запись в трекере есть. Всегда делает запросы к БД.
   * Если выключен, делает запрос только недостающих изменений.
   *
   * По-умолчанию `true`
   */
  force?: boolean;
};

export type ReadRepositoryUseFindOptions = {
  /**
   * Включает механизм трекинга. Берет данные из трекера, а так же отслеживает все сущности.
   * Используется механизм трекинга при запросе кешированных (затреканных значений), а также заносит все новые данные туда.
   *
   * Если выключен, каждый раз возвращаются новые сущности. Данные так же не запрашиваются из трекинга.
   *
   * По-умолчанию `true`,
   */
  useTracking?: boolean;
  /**
   * Обновляет данные сущности в трекере (ссылка не меняется).
   *
   * Когда выключен, если данные есть в контексте, состояние не обновляется
   *
   * По-умолчанию `false`.
   */
  updateState?: boolean;
};

export interface IReadHooksRepository<TEntity extends Entity> {
  /** Трекинг-хелпер, позволяющий запрашивать сущность с обязательным запросом в БД (можно отключить). */
  useFetch(
    entity: TEntity,
    callbackQuery: (primaryKey: EntityInferPrimaryKey<TEntity>) => Promise<TEntity | NullableObject>,
    options: ReadRepositoryUseFetchOptions,
  ): Promise<TEntity | NullableObject>;
  /** Трекинг-хелпер, позволяющий запрашивать сущности с обязательным запросом в БД (можно отключить). */
  useFetchMany(
    entities: TEntity[],
    callbackQuery: (primaryKeys: EntityInferPrimaryKey<TEntity>[]) => Promise<(TEntity | NullableObject)[]>,
    options: ReadRepositoryUseFetchOptions,
  ): Promise<(TEntity | NullableObject)[]>;

  /** Трекинг-хелпер, позволяющий запрашивать сущность по ее ключу с потенциальным запросом в БД.  */
  useGet(primaryKey: EntityInferPrimaryKey<TEntity>, callbackQuery: () => Promise<TEntity | NullableObject>, options: ReadRepositoryUseFindPrimaryKeyOptions): Promise<TEntity | NullableObject>;
  /** Трекинг-хелпер, позволяющий запрашивать сущности по их ключам с потенциальным запросом в БД.  */
  useGetMany(
    primaryKeys: EntityInferPrimaryKey<TEntity>[],
    callbackQuery: (primaryKeys: EntityInferPrimaryKey<TEntity>[]) => Promise<(TEntity | NullableObject)[]>,
    options: ReadRepositoryUseFindPrimaryKeyOptions,
  ): Promise<(TEntity | NullableObject)[]>;

  /** Трекинг-хелпеп, позволяющий внедрять сущность в трекинг и возвращать сущность, если она уже в трекинге */
  useFirst(callbackQuery: () => Promise<NullableObject>, options: ReadRepositoryUseFindOptions): Promise<NullableObject>;
  useFirst(callbackQuery: () => Promise<TEntity>, options: ReadRepositoryUseFindOptions): Promise<TEntity>;
  useFirst(callbackQuery: () => Promise<TEntity | NullableObject>, options: ReadRepositoryUseFindOptions): Promise<TEntity | NullableObject>;

  /** Трекинг-хелпеп, позволяющий внедрять сущности в трекинг и возвращать сущности, если они уже в трекинге */
  useFindMany(callbackQuery: () => Promise<TEntity[]>, options: ReadRepositoryUseFindOptions): Promise<TEntity[]>;
  useFindManyWithNullable(callbackQuery: () => Promise<(TEntity | NullableObject)[]>, options: ReadRepositoryUseFindOptions): Promise<(TEntity | NullableObject)[]>;
}
