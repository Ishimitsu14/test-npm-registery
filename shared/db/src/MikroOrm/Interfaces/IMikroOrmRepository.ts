import { ConstructorType } from '@ddd/core';
import { Entity, EntityInferPrimaryKey } from '@ddd/domain';
import { IRepository, ISnapshotEntity } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';
import { QueryBuilder } from '@mikro-orm/postgresql';

import { MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN, MIKRO_ORM_INJECT_TOKEN } from '../InjectTokens';

export type MikroOrmQueryBuilderPredicate<TSnapshot extends object> = (qb: QueryBuilder<TSnapshot>) => QueryBuilder<TSnapshot>;

export interface IMikroOrmRepository<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>> extends IRepository<TEntity>, IQueryRepository<TEntity> {
  orm: MIKRO_ORM_INJECT_TOKEN;
  em: MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN;

  readonly SnapshotType: ConstructorType<TSnapshot>;
  // snapshotMapper: ISnapshotEntityMapper<TEntity, TSnapshot>;

  // getMetadata(): EntityMetadata;
  createSnapshotFromPK(primaryKey: EntityInferPrimaryKey<TEntity>): TSnapshot;
  createSnapshotFromEntity(entity: TEntity): TSnapshot;
}
