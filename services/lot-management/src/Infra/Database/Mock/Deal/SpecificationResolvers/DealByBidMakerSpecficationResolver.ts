import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { DealByBidMakerSpecfication } from '../../../../../Domain';

@RegisterSpecificationResolver(DealByBidMakerSpecfication)
export class DealByBidMakerSpecficationResolver extends MockSpecificationResolver<DealByBidMakerSpecfication> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
