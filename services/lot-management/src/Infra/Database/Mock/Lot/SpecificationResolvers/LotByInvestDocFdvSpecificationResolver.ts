import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByInvestDocFdvSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByInvestDocFdvSpecification)
export class LotByInvestDocFdvSpecificationResolver extends MockSpecificationResolver<LotByInvestDocFdvSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
