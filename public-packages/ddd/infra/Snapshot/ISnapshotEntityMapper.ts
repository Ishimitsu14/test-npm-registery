import { ConstructorType } from '../../core';
import { Entity, EntityInferPrimaryKey } from '../../domain';
import { ISnapshot } from './ISnapshot';
import { ISnapshotMapper } from './ISnapshotMapper';

export interface ISnapshotEntityMapper<T extends Entity, TSnapshot extends ISnapshot<T>> extends ISnapshotMapper<T, TSnapshot> {
  getSnapshotTarget(): ConstructorType<TSnapshot, {}>;
  fromPK(primaryKey: EntityInferPrimaryKey<T>): Partial<TSnapshot>;
}
