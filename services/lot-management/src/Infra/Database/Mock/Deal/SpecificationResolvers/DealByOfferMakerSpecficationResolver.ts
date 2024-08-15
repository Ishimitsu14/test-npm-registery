import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { DealByOfferMakerSpecfication } from '../../../../../Domain';

@RegisterSpecificationResolver(DealByOfferMakerSpecfication)
export class DealByOfferMakerSpecficationResolver extends MockSpecificationResolver<DealByOfferMakerSpecfication> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
