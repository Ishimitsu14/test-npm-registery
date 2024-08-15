import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { LotIdSortable } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSortableResolver(LotIdSortable)
export class LotIdSortableResolver extends MikroOrmSortableResolver<LotIdSortable, LotSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        id: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
