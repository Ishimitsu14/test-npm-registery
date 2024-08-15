import { DbTransactionExecutePayload } from '@ddd/infra';

import { MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN, MIKRO_ORM_INJECT_TOKEN } from '../InjectTokens';

export interface MikroOrmDbTransactionExecutePayload extends DbTransactionExecutePayload {
  orm: MIKRO_ORM_INJECT_TOKEN;
  manager: MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN;
}
