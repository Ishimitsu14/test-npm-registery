import { DbTransactionExecutePayload } from '@ddd/infra';

import { MockStoreRegistry } from '../MockStore';

export interface MockDbTransactionExecutePayload extends DbTransactionExecutePayload {
  registry: MockStoreRegistry;
}
