import { RegisterSortableResolver } from '@ddd/specifications';
import { MikroOrmSortableResolver } from '@shared/db';

import { AssetIdSortable } from '../../../../../Domain';
import { AssetSnapshot } from '../Snapshots';

@RegisterSortableResolver(AssetIdSortable)
export class AssetIdSortableResolver extends MikroOrmSortableResolver<AssetIdSortable, AssetSnapshot> {
  setup(): void {
    this.addPredicate((sortable) => {
      return {
        id: MikroOrmSortableResolver.getQueryOrder(sortable.value),
      };
    });
  }
}
