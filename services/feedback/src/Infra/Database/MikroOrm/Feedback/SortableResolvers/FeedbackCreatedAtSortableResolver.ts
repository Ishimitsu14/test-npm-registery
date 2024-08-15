import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { FeedbackCreatedAtSortable } from '../../../../../Domain';
import { FeedbackSnapshot } from '../Snapshots';

@RegisterSortableResolver(FeedbackCreatedAtSortable)
export class FeedbackCreatedAtSortableResolver extends MikroOrmSortableResolver<FeedbackCreatedAtSortable, FeedbackSnapshot> {
  setup() {
    this.addPredicate((sortable) => {
      return {
        createdAt: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
