import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByAssetCreateRequestSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByAssetCreateRequestSpecification)
export class LotByAssetCreateRequestSpecificationResolver extends MockSpecificationResolver<LotByAssetCreateRequestSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
