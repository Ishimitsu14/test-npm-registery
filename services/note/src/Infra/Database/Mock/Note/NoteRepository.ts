import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { INoteRepository, Note, NotePK } from '../../../../Domain';

export class NoteRepository extends MockRepository<Note> implements INoteRepository {
  readonly EntityType = Note;

  nextIdentity(): NotePK {
    return NotePK.raw(v4());
  }
}
