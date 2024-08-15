import { createDbTrigger, DbTrigger } from '../DbTriggers';

// transactionCount
export type DbContextOnBeforeTrigger = DbTrigger<[transactionCount: number]>;
export type DbContextOnSuccessTrigger = DbTrigger<[]>;
export type DbContextOnFailTrigger = DbTrigger<[]>;
export type DbContextOnThrowTrigger = DbTrigger<[error: any]>;

export interface DbContextTriggers {
  onBefore: DbContextOnBeforeTrigger;
  onSuccess: DbContextOnSuccessTrigger;
  onFail: DbContextOnFailTrigger;
  onThrow: DbContextOnThrowTrigger;
}

export function DbContextTriggers(): DbContextTriggers {
  return {
    onBefore: createDbTrigger(false),
    onSuccess: createDbTrigger(false),
    onFail: createDbTrigger(false),
    onThrow: createDbTrigger(false),
  };
}
