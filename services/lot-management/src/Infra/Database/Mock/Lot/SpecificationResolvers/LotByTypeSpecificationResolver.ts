import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByTypeSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByTypeSpecification)
export class LotByTypeSpecificationResolver extends MockSpecificationResolver<LotByTypeSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
