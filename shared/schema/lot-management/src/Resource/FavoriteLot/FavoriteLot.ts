import { CoreSchema } from '@schema/core';

import { UserKey } from '../Actors';
import { LotKey } from '../Lot';
import { FavoriteLotKey } from './FavoriteLotPK';

export interface FavoriteLot extends CoreSchema.Resource<'favorite_lot', FavoriteLotKey> {
  userKey: UserKey;
  lotKey: LotKey;
  createdAt: number;
}
