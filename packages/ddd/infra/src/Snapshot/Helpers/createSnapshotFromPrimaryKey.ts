import { ConstructorType } from '@ddd/core';
import { Entity, EntityInferPrimaryKey } from '@ddd/domain';

import { ISnapshotEntity } from '../ISnapshotEntity';
import { createSnapshotEmpty } from './createSnapshotEmpty';

export function createSnapshotFromPrimaryKey<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>>(
  snapshotType: ConstructorType<TSnapshot>,
  primaryKey: EntityInferPrimaryKey<TEntity>,
): TSnapshot {
  const snapshot = createSnapshotEmpty(snapshotType);
  snapshot.applyPK(primaryKey);
  return snapshot;
}
