import { CoreSchema } from '../../../core';
import { NotePK } from './NotePK';

export interface Note extends CoreSchema.Resource<'note', NotePK> {
  namespace: string;
  entity: string;
  entityPk: string;
  text: string;
  createdAt: number;
}
