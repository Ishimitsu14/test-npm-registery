import { Inject } from '@nestjs/common';
import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';

import { LotResourceMapper } from './LotResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export class FavoriteLotResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  toFavoriteLotKey(item: LotManagementSchema.FavoriteLotKey): Required<DeskGatewaySchema.FavoriteLotKey> {
    return {
      resource: 'favorite_lot_key',
      id: item.id,
    };
  }

  toFavoriteLot(item: LotManagementSchema.FavoriteLot): Required<DeskGatewaySchema.FavoriteLot> {
    return {
      resource: 'favorite_lot',
      id: item.id,
      userKey: this.userResourceMapper.toUserKey(item.userKey),
      lotKey: this.lotResourceMapper.toLotKey(item.lotKey),
      createdAt: item.createdAt,
    };
  }
}
