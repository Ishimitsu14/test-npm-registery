import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { AssetByStatusSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(AssetByStatusSpecification)
export class AssetByStatusSpecificationResolver extends MockSpecificationResolver<AssetByStatusSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
