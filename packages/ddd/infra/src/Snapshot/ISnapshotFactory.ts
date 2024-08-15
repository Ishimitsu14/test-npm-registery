import { PrototypeType } from '@ddd/core';
import { Entity, EntityInferPrimaryKey } from '@ddd/domain';

import { ISnapshot } from './ISnapshot';

export interface ISnapshotFactory<T extends Entity> extends PrototypeType<ISnapshot<T>> {
  fromPK(primaryKey: EntityInferPrimaryKey<T>): any;
  fromDomain(domain: T): ISnapshot<T>;
}
