import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { LotCommonBadgeSortable } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSortableResolver(LotCommonBadgeSortable)
export class LotCommonBadgeSortableResolver extends MikroOrmSortableResolver<LotCommonBadgeSortable, LotSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        attributes: {
          commonBadge: {
            sort: MikroOrmSortableResolver.getQueryOrder(sortable.value),
          },
        },
      };
    });
  }
}
