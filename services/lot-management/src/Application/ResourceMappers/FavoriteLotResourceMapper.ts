import { LotManagementSchema } from '@schema/lot-management';

import { FavoriteLot, LotPK, UserPK } from '../../Domain';

export class FavoriteLotResourceMapper {
  toFavoriteLot(favoriteLot: FavoriteLot): LotManagementSchema.FavoriteLot {
    return {
      resource: 'favorite_lot',
      id: favoriteLot.primaryKey.id,
      userKey: this.toUserKey(favoriteLot.userPK),
      lotKey: this.toLotKey(favoriteLot.lotPK),
      createdAt: +favoriteLot.createdAt,
    };
  }

  toUserKey(userPK: UserPK): LotManagementSchema.UserKey {
    return {
      resource: 'user_key',
      id: userPK.id,
    };
  }

  toLotKey(lotPK: LotPK): LotManagementSchema.LotKey {
    return {
      resource: 'lot_key',
      id: lotPK.id,
    };
  }
}
