import { Sortable } from '@ddd/specifications';

import { Asset } from '../Asset';

export class AssetIdSortable extends Sortable<Asset> {
  protected initialize(): void {
    this.addSort((lot) => lot.primaryKey.id);
  }
}
