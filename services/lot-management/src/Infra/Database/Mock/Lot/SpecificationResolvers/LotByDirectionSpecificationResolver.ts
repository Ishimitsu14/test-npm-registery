import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByDirectionSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByDirectionSpecification)
export class LotByDirectionSpecificationResolver extends MockSpecificationResolver<LotByDirectionSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
