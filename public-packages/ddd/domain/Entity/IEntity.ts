import { Equatable } from '../../core';
import { IEntityKey } from '../EntityKey';

export interface IEntity<PrimaryKey extends IEntityKey> extends Equatable<IEntity<PrimaryKey>> {
  get primaryKey(): PrimaryKey;
  hasPrimaryKey(): boolean;
}
