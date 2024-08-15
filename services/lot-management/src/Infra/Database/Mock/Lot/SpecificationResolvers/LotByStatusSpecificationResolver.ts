import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByStatusSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByStatusSpecification)
export class LotByStatusSpecificationResolver extends MockSpecificationResolver<LotByStatusSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
