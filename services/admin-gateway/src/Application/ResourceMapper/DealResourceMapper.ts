import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { LotManagementSchema } from '@schema/lot-management';

import { BidResourceMapper } from './BidResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export class DealResourceMapper {
  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  toDealKey(item: LotManagementSchema.DealKey): Required<AdminGatewaySchema.DealKey> {
    return {
      resource: 'deal_key',
      id: item.id,
    };
  }

  toDeal(item: LotManagementSchema.Deal): Required<AdminGatewaySchema.Deal> {
    return {
      resource: 'deal',
      id: item.id,

      createdAt: item.createdAt,
      status: item.status,
      keyResults: item.keyResults,
      summary: item.summary,
      units: item.units,
      price: item.price,
      fdv: item.fdv,

      bidKey: this.bidResourceMapper.toBidKey(item.bidKey),
      offerMakers: item.offerMakers.map((m) => this.userResourceMapper.toUserKey(m)),
      bidMakers: item.bidMakers.map((m) => this.userResourceMapper.toUserKey(m)),
    };
  }
}
