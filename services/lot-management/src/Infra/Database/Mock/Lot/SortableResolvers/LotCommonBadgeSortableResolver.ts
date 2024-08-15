import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { LotCommonBadgeSortable } from '../../../../../Domain';

@RegisterSortableResolver(LotCommonBadgeSortable)
export class LotCommonBadgeSortableResolver extends MockSortableResolver<LotCommonBadgeSortable> {
  async setup(): Promise<void> {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
