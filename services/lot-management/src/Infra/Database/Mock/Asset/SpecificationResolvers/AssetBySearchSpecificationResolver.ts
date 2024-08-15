import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { AssetBySearchSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(AssetBySearchSpecification)
export class AssetBySearchSpecificationResolver extends MockSpecificationResolver<AssetBySearchSpecification> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => {
      return entities.filter((entity) => spec.isSatisfied(entity));
    });
  }
}
