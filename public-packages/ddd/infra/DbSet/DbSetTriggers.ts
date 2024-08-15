import { Entity } from '../../domain';
import { createDbTrigger, DbTrigger } from '../DbTriggers';

export type DbSetOnBeforeTrigger = DbTrigger<[transactionCount: number]>;
export type DbSetOnSuccessTrigger = DbTrigger<[]>;
export type DbSetOnFailTrigger = DbTrigger<[]>;
export type DbSetOnThrowTrigger = DbTrigger<[error: any]>;

export interface DbSetTriggers<TEntity extends Entity> {
  onBefore: DbSetOnBeforeTrigger;
  onSuccess: DbSetOnSuccessTrigger;
  onFail: DbSetOnFailTrigger;
  onThrow: DbSetOnThrowTrigger;
}

export function DbSetTriggers<TEntity extends Entity>(): DbSetTriggers<TEntity> {
  return {
    onBefore: createDbTrigger(false),
    onSuccess: createDbTrigger(false),
    onFail: createDbTrigger(false),
    onThrow: createDbTrigger(false),
  };
}
