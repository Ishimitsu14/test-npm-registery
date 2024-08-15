import { Entity, EntityConstructor } from '../../domain';
import { DbTransactionExecuteTriggers } from './DbTransactionTriggers';

export interface DbTransactionExecutePayload {
  transactionTriggers: DbTransactionExecuteTriggers;
}

export type DbTransactionExecuteFunction<Payload extends DbTransactionExecutePayload> = (payload: Payload) => Promise<void>;

export interface DbTransaction<Payload extends DbTransactionExecutePayload = DbTransactionExecutePayload> {
  id: string;
  execute: DbTransactionExecuteFunction<Payload>;

  entityType?: EntityConstructor<Entity>;
}
