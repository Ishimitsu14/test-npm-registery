import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { AssetFaqByAssetSpecfication } from '../../../../../Domain';

@RegisterSpecificationResolver(AssetFaqByAssetSpecfication)
export class AssetFaqByAssetSpecficationResolver extends MockSpecificationResolver<AssetFaqByAssetSpecfication> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
