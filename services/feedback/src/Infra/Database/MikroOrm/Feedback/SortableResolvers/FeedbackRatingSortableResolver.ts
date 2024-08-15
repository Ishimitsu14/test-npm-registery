import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { FeedbackRatingSortable } from '../../../../../Domain';
import { FeedbackSnapshot } from '../Snapshots';

@RegisterSortableResolver(FeedbackRatingSortable)
export class FeedbackRatingSortableResolver extends MikroOrmSortableResolver<FeedbackRatingSortable, FeedbackSnapshot> {
  setup() {
    this.addPredicate((sortable) => {
      return {
        rating: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
