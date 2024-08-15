import { CoreSchema } from '@schema/core';

import { NotePK } from './NotePK';

export interface Note extends CoreSchema.Resource<'note', NotePK> {
  text: string;
  namespace: string;
  entity: string;
  entityPk: string;
  createdAt: number;
}
