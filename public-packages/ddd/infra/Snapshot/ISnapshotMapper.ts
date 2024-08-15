import { ISnapshot } from './ISnapshot';

export interface ISnapshotMapper<T, Snapshot extends ISnapshot<T>> {
  fromDomain(domain: T): Snapshot;
  toDomain(snapshot: Snapshot): T;
}
