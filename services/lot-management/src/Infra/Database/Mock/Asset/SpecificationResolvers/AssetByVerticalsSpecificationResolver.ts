import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { AssetByVerticalsSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(AssetByVerticalsSpecification)
export class AssetByVerticalsSpecificationResolver extends MockSpecificationResolver<AssetByVerticalsSpecification> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
