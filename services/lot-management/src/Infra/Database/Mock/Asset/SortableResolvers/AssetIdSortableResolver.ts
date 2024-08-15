import { RegisterSortableResolver } from '@ddd/specifications';
import { MockSortableResolver } from '@shared/db';

import { AssetIdSortable } from '../../../../../Domain';

@RegisterSortableResolver(AssetIdSortable)
export class AssetIdSortableResolver extends MockSortableResolver<AssetIdSortable> {
  setup(): void {
    this.addPredicate((sortable) => (entities) => sortable.sort(entities));
  }
}
