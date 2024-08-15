import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { INoteRepository, Note, NotePK } from '../../../../Domain';
import { NoteSnapshot } from './Snapshots';

export class NoteRepository extends MikroOrmRepository<Note, NoteSnapshot> implements INoteRepository {
  readonly EntityType = Note;
  readonly SnapshotType = NoteSnapshot;

  nextIdentity(): NotePK {
    return NotePK.raw(v4());
  }
}
