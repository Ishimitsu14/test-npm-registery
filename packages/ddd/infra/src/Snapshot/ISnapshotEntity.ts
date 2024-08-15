import { Entity, EntityInferPrimaryKey } from '@ddd/domain';

import { ISnapshot } from './ISnapshot';

export interface ISnapshotEntity<TEntity extends Entity> extends ISnapshot<TEntity> {
  applyPK(primaryKey: EntityInferPrimaryKey<TEntity>): void;
}
