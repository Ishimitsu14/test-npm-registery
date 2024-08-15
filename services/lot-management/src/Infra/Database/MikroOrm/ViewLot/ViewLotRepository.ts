import { MikroOrmRepository } from '@shared/db';
import { v4 } from 'uuid';

import { IViewLotRepository, ViewLot, ViewLotPk } from '../../../../Domain';
import { ViewLotSnapshot } from './Snapshots';

export class ViewLotRepository extends MikroOrmRepository<ViewLot, ViewLotSnapshot> implements IViewLotRepository {
  readonly EntityType = ViewLot;
  readonly SnapshotType = ViewLotSnapshot;

  async nextPk(): Promise<ViewLotPk> {
    return ViewLotPk.raw(v4());
  }
}
