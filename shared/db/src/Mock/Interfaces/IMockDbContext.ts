import { IDbContext } from '@ddd/infra';

import { MockDbTransactionExecutePayload } from './IMockDbCommand';

export interface IMockDbContext extends IDbContext<MockDbTransactionExecutePayload> {}
