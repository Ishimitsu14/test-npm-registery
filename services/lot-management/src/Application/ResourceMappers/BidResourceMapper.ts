import { NullableObject } from '@ddd/core';
import { forwardRef, Inject } from '@nestjs/common';
import { LotManagementSchema } from '@schema/lot-management';

import { Bid, BidPK } from '../../Domain/';
import { ActorResourceMapper } from './ActorResourceMapper';
import { AssetResourceMapper } from './AssetResourceMapper';
import { CommonResourceMapper } from './CommonResourceMapper';
import { DealResourceMapper } from './DealResourceMapper';
import { LotResourceMapper } from './LotResourceMapper';

export class BidResourceMapper {
  @Inject(CommonResourceMapper)
  private commonResourceMapper: CommonResourceMapper;

  @Inject(ActorResourceMapper)
  private actorResourceMapper: ActorResourceMapper;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  @Inject(AssetResourceMapper)
  private assetResourceMapper: AssetResourceMapper;

  @Inject(forwardRef(() => DealResourceMapper))
  private dealResourceMapper: DealResourceMapper;

  toBidKey(bidPK: BidPK): Required<LotManagementSchema.BidKey> {
    return { resource: 'bid_key', id: bidPK.id };
  }

  toBid(bid: Bid): Required<LotManagementSchema.Bid> {
    return {
      resource: 'bid',
      id: bid.primaryKey.id,

      status: bid.status.id,
      createdAt: +bid.createdAt,
      deadline: NullableObject.mapUndefined(bid.deadline, (m) => +m),
      bidMakerType: bid.bidMakerType.id,
      location: bid.location.id,
      mediatorType: bid.mediatorType.id,
      telegram: bid.telegram.value,
      readyForVerification: bid.readyForVerification,
      rejectReason: NullableObject.mapUndefined(bid.rejectReason, (m) => m.id),
      summary: bid.summary.value.toString(),
      units: NullableObject.mapUndefined(bid.units, (m) => m.value.toString()),
      price: NullableObject.mapUndefined(bid.price, (m) => m.value.toString()),
      fdv: NullableObject.mapUndefined(bid.fdv, (m) => m.value.toString()),

      lotKey: this.lotResourceMapper.toLotKey(bid.lotPK),
      bidMakerKey: this.actorResourceMapper.toBidMakerKey(bid.bidMaker),
    };
  }
}
