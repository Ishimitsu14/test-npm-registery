import { NoteSchema } from '@schema/note';

import { Note } from '../../Domain';

export class NoteResourceMapper {
  toNotePK(note: Note): Required<NoteSchema.NotePK> {
    return {
      resource: 'note_key',
      id: note.primaryKey.id,
    };
  }

  toNote(note: Note): Required<NoteSchema.Note> {
    return {
      resource: 'note',
      id: note.primaryKey.id,
      namespace: note.namespace,
      entity: note.entity,
      entityPk: note.entityPk,
      text: note.text,
      createdAt: +note.createdAt,
    };
  }
}
