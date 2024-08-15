import { Sortable } from '@ddd/specifications';

import { Lot } from '../Lot';

export class LotIdSortable extends Sortable<Lot> {
  protected initialize(): void {
    this.addSort((item) => item.primaryKey.id);
  }
}
