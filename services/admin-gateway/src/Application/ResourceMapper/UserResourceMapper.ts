import { AdminGatewaySchema } from '@schema/admin-gateway';
import { LotManagementSchema } from '@schema/lot-management';
import { UserIdentitySchema } from '@schema/user-identity';

export class UserResourceMapper {
  toUserKey(item: LotManagementSchema.OfferMakerKey | LotManagementSchema.BidMakerKey | UserIdentitySchema.UserKey): Required<AdminGatewaySchema.UserKey> {
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

  toUser(item: UserIdentitySchema.User): Required<AdminGatewaySchema.User> {
    return {
      resource: 'user',
      id: item.id,
      nickname: item.nickname,
      registeredAt: item.registered_at,
      profile: this.toUserProfile(item.profile),
      authData: this.toUserAuthData(item.auth_data),
      verification: this.toUserVerification(item.verification),
      roles: item.roles.map((role) => this.toUserRole(role)),
    };
  }

  toUserRole(item: UserIdentitySchema.UserRole): Required<AdminGatewaySchema.UserRole> {
    return {
      resource: 'user_role',
      id: item.id,
      createdAt: item.createdAt,
      userKey: this.toUserKey(item.userKey),
      type: item.type,
    };
  }

  toUserAuthData(item: UserIdentitySchema.UserAuthData): Required<AdminGatewaySchema.UserAuthData> {
    return {
      walletAddress: item.address,
    };
  }

  toUserProfile(item: UserIdentitySchema.UserProfile): Required<AdminGatewaySchema.UserProfile> {
    return {
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      location: item.location,
      telegram: item.telegram,
    };
  }

  toUserVerification(item: UserIdentitySchema.UserVerification): Required<AdminGatewaySchema.UserVerification> {
    return {
      isVerified: item.is_verified,
    };
  }
}
