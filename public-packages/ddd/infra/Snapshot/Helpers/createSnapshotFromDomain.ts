import { ConstructorType } from '../../core';
import { ISnapshot } from '../ISnapshot';
import { createSnapshotEmpty } from './createSnapshotEmpty';

export function createSnapshotFromDomain<TDomain, TSnapshot extends ISnapshot<TDomain>>(snapshotType: ConstructorType<TSnapshot>, domain: TDomain): TSnapshot {
  const snapshot = createSnapshotEmpty(snapshotType);

  snapshot.applyDomain(domain);

  return snapshot;
}
