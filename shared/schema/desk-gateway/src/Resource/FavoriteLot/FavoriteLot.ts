import { CoreSchema } from '@schema/core';

import { LotKey } from '../Lot';
import { UserKey } from '../User';
import { FavoriteLotKey } from './FavoriteLotPK';

export interface FavoriteLot extends CoreSchema.Resource<'favorite_lot', FavoriteLotKey> {
  userKey: UserKey;
  lotKey: LotKey;
  createdAt: number;
}
