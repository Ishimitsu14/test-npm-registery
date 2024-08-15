import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { BidIdSortable } from '../../../../../Domain';
import { BidSnapshot } from '../Snapshots';

@RegisterSortableResolver(BidIdSortable)
export class BidIdSortableResolver extends MikroOrmSortableResolver<BidIdSortable, BidSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        id: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
