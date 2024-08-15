import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { NoteCreatedAtSortable } from '../../../../../Domain';

@RegisterSortableResolver(NoteCreatedAtSortable)
export class NoteCreatedAtSortableResolver extends MockSortableResolver<NoteCreatedAtSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
