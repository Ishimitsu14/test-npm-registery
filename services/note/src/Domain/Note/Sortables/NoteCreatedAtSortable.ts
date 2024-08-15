import { Sortable } from '@ddd/specifications';

import { Note } from '../Note';

export class NoteCreatedAtSortable extends Sortable<Note> {
  protected initialize() {
    this.addSort((item) => item.createdAt);
  }
}
