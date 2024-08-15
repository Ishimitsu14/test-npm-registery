import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { NoteCreatedAtSortable } from '../../../../../Domain';
import { NoteSnapshot } from '../Snapshots';

@RegisterSortableResolver(NoteCreatedAtSortable)
export class NoteCreatedAtSortableResolver extends MikroOrmSortableResolver<NoteCreatedAtSortable, NoteSnapshot> {
  setup() {
    this.addPredicate((sortable) => {
      return {
        createdAt: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
