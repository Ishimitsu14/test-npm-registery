import { ConstructorType } from '../../core';
import { ISnapshot } from '../ISnapshot';

export function createSnapshotEmpty<TSnapshot extends ISnapshot<any>>(snapshotType: ConstructorType<TSnapshot>): TSnapshot {
  const snapshot: TSnapshot = snapshotType?.prototype && Object.create(snapshotType?.prototype);

  return snapshot;
}
