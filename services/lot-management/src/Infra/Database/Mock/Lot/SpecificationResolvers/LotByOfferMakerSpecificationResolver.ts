import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { LotByOfferMakerSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByOfferMakerSpecification)
export class LotByOfferMakerSpecificationResolver extends MockSpecificationResolver<LotByOfferMakerSpecification> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
