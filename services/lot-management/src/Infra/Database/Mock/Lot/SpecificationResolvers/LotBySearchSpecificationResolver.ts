import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotBySearchSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotBySearchSpecification)
export class LotBySearchSpecificationResolver extends MockSpecificationResolver<LotBySearchSpecification> {
  setup(): void {
    // this.addSpecificationPredicate((spec) => spec);
    // this.addPredicate((spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
