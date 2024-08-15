import { CoreSchema } from '@schema/core';

import { LotKey } from '../Lot';
import { ViewLotKey } from './ViewLotPK';

export interface ViewLot extends CoreSchema.Resource<'view_lot', ViewLotKey> {
  lotPk: LotKey;
  createdAt: number;
}
