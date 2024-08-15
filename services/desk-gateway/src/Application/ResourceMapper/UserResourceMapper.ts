import { DeskGatewaySchema } from '@schema/desk-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { UserIdentitySchema } from '@schema/user-identity';

export class UserResourceMapper {
  toUserKey(item: LotManagementSchema.OfferMakerKey | LotManagementSchema.BidMakerKey | UserIdentitySchema.UserKey): Required<DeskGatewaySchema.UserKey> {
    if (item.resource === 'bid_maker_key')
      return {
        resource: 'user_key',
        id: item.userId,
      };

    if (item.resource === 'offer_maker_key') {
      return {
        resource: 'user_key',
        id: item.userId,
      };
    }

    return {
      resource: 'user_key',
      id: item.id,
    };
  }

  toUser(item: UserIdentitySchema.User): Required<DeskGatewaySchema.User> {
    return {
      resource: 'user',
      id: item.id,
      address: item.auth_data.address,
      nickname: item.nickname,
      isVerified: item.verification.is_verified,
      registeredAt: item.registered_at,
    };
  }
}
