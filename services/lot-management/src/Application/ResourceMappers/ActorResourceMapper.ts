import { LotManagementSchema } from '@schema/lot-management';

import { BidMakerPK, OfferMakerPK } from '../../Domain';

export class ActorResourceMapper {
  toOfferMakerKey(value: OfferMakerPK): Required<LotManagementSchema.OfferMakerKey> {
    return {
      resource: 'offer_maker_key',
      userId: value.userId,
    };
  }

  toBidMakerKey(value: BidMakerPK): Required<LotManagementSchema.BidMakerKey> {
    return {
      resource: 'bid_maker_key',
      userId: value.userId,
    };
  }
}
