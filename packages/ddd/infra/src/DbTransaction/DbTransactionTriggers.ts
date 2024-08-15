import { createDbTrigger, DbTrigger } from '../DbTriggers';

export type DbTransactionOnSuccessTrigger = DbTrigger<[]>;
export type DbTransactionOnFailTrigger = DbTrigger<[]>;
export type DbTransactionOnThrowTrigger = DbTrigger<[error: any]>;

export interface DbTransactionExecuteTriggers {
  onSuccess: DbTransactionOnSuccessTrigger;
  onFail: DbTransactionOnFailTrigger;
}

export function DbTransactionExecuteTriggers(): DbTransactionExecuteTriggers {
  return {
    onSuccess: createDbTrigger(true),
    onFail: createDbTrigger(true),
  };
}
