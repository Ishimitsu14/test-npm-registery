import { Inject } from '@nestjs/common';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { LotManagementSchema } from '@schema/lot-management';

import { LotResourceMapper } from './LotResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';

export class BidResourceMapper {
  @Inject(UserResourceMapper)
  private userResourceMapper: UserResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  toBidKey(item: LotManagementSchema.BidKey): Required<AdminGatewaySchema.BidKey> {
    return { resource: 'bid_key', id: item.id };
  }

  toBid(item: LotManagementSchema.Bid): Required<AdminGatewaySchema.Bid> {
    return {
      resource: 'bid',
      id: item.id,

      createdAt: item.createdAt,
      deadline: item.deadline,
      status: item.status,
      bidMakerType: item.bidMakerType,
      location: item.location,
      mediatorType: item.mediatorType,
      telegram: item.telegram,
      readyForVerification: item.readyForVerification,
      rejectReason: item.rejectReason,

      summary: item.summary,
      units: item.units,
      price: item.price,
      fdv: item.fdv,

      bidMakerKey: this.userResourceMapper.toUserKey(item.bidMakerKey),
      lotKey: this.lotResourceMapper.toLotKey(item.lotKey),
    };
  }
}
