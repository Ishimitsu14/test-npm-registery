import { Sortable } from '@ddd/specifications';

import { Bid } from '../Bid';

export class BidIdSortable extends Sortable<Bid> {
  protected initialize(): void {
    this.addSort((item) => item.primaryKey.id);
  }
}
