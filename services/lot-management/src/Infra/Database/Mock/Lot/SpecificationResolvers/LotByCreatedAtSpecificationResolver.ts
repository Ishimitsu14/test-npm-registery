import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByCreatedAtSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByCreatedAtSpecification)
export class LotByCreatedAtSpecificationResolver extends MockSpecificationResolver<LotByCreatedAtSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
