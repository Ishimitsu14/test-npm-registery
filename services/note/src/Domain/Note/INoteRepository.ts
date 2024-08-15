import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

import { Note } from './Note';
import { NotePK } from './NotePK';

export interface INoteRepository extends IRepository<Note>, IQueryRepository<Note> {
  nextIdentity(): NotePK;
}
