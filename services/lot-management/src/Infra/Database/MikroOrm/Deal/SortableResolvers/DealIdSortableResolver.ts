import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { DealIdSortable } from '../../../../../Domain';
import { DealSnapshot } from '../Snapshots';

@RegisterSortableResolver(DealIdSortable)
export class DealIdSortableResolver extends MikroOrmSortableResolver<DealIdSortable, DealSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        id: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
