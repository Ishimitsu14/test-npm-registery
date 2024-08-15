import { Sortable } from '@ddd/specifications';

import { DealTransaction } from '../DealTransaction';

export class DealTransactionIdSortable extends Sortable<DealTransaction> {
  protected initialize(): void {
    this.addSort((item) => item.primaryKey.id);
  }
}
