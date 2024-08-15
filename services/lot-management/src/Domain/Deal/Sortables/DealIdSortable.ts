import { Sortable } from '@ddd/specifications';

import { Deal } from '../Deal';

export class DealIdSortable extends Sortable<Deal> {
  protected initialize(): void {
    this.addSort((item) => item.primaryKey.id);
  }
}
