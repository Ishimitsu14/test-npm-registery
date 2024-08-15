import { ConstructorType } from '../../core';
import { Entity, EntityInferPrimaryKey } from '../../domain';
import { ISnapshotEntity } from '../ISnapshotEntity';
import { createSnapshotEmpty } from './createSnapshotEmpty';

export function createSnapshotFromEntity<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>>(snapshotType: ConstructorType<TSnapshot>, entity: TEntity): TSnapshot {
  const snapshot = createSnapshotEmpty(snapshotType);

  snapshot.applyPK(<EntityInferPrimaryKey<TEntity>>entity.primaryKey);
  snapshot.applyDomain(entity);

  return snapshot;
}
