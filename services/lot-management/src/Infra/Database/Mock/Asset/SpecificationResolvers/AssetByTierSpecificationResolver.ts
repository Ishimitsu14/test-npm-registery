import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { AssetByTierSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(AssetByTierSpecification)
export class AssetByTierSpecificationResolver extends MockSpecificationResolver<AssetByTierSpecification> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
