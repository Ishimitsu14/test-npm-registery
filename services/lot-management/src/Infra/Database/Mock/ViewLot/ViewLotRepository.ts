import { MockRepository } from '@shared/db';
import { v4 } from 'uuid';

import { IViewLotRepository, ViewLot, ViewLotPk } from '../../../../Domain';

export class ViewLotRepository extends MockRepository<ViewLot> implements IViewLotRepository {
  readonly EntityType = ViewLot;

  async nextPk(): Promise<ViewLotPk> {
    return ViewLotPk.raw(v4());
  }
}
