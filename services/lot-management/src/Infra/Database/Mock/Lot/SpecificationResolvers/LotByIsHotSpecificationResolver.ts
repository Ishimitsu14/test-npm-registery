import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByIsHotSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByIsHotSpecification)
export class LotByIsHotSpecificationResolver extends MockSpecificationResolver<LotByIsHotSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
