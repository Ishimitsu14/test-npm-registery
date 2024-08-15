import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { DealTransactionIdSortable } from '../../../../../Domain';
import { DealTransactionSnapshot } from '../Snapshots';

@RegisterSortableResolver(DealTransactionIdSortable)
export class DealTransactionIdSortableResolver extends MikroOrmSortableResolver<DealTransactionIdSortable, DealTransactionSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        id: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
