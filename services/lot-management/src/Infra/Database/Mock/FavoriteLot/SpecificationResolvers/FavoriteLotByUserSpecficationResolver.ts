import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MockSpecificationResolver } from '@shared/db';

import { FavoriteLotByUserSpecfication } from '../../../../../Domain';

@RegisterSpecificationResolver(FavoriteLotByUserSpecfication)
export class FavoriteLotByUserSpecficationResolver extends MockSpecificationResolver<FavoriteLotByUserSpecfication> {
  setup(): void {
    this.addPredicate(async (spec) => async (entities) => entities.filter((entity) => spec.isSatisfied(entity)));
  }
}
