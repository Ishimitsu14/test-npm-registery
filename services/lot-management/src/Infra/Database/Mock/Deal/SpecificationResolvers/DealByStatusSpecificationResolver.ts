import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { DealByStatusSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(DealByStatusSpecification)
export class DealByStatusSpecificationResolver extends MockSpecificationResolver<DealByStatusSpecification> {
  setup(): void {
    this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
