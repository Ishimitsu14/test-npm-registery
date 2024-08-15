import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { FavoriteLotByUserSpecfication } from '../../../../../Domain';
import { FavoriteLotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(FavoriteLotByUserSpecfication)
export class FavoriteLotByUserSpecficationResolver extends MikroOrmSpecificationResolver<FavoriteLotByUserSpecfication, FavoriteLotSnapshot> {
  setup(): void {
    this.addWhere(async (spec, payload) => ({
      userId: {
        $in: spec.userPKs.map((m) => m.id),
      },
    }));
  }
}
