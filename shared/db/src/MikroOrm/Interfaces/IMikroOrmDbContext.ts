import { IDbContext } from '@ddd/infra';

import { MikroOrmDbTransactionExecutePayload } from './MikroOrmDbTransactionExecutePayload';

export interface IMikroOrmDbContext extends IDbContext<MikroOrmDbTransactionExecutePayload> {}
