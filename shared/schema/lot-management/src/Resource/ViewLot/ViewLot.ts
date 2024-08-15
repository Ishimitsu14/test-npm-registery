import { CoreSchema } from '@schema/core';

import { ViewLotKey } from './ViewLotPK';

export interface ViewLot extends CoreSchema.Resource<'view_lot', ViewLotKey> {
  lotId: ViewLotKey;
  createdAt: number;
}
