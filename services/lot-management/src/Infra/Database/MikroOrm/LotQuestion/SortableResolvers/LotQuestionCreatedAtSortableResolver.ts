import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { LotQuestionCreatedAtSortable } from '../../../../../Domain';
import { LotQuestionSnapshot } from '../Snapshots';

@RegisterSortableResolver(LotQuestionCreatedAtSortable)
export class LotQuestionCreatedAtSortableResolver extends MikroOrmSortableResolver<LotQuestionCreatedAtSortable, LotQuestionSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        createdAt: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
