import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByReassignmentTypeSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByReassignmentTypeSpecification)
export class LotByReassignmentTypeSpecificationResolver extends MockSpecificationResolver<LotByReassignmentTypeSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
