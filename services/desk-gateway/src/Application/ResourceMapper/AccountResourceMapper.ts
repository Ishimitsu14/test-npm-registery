import { DeskGatewaySchema } from '@schema/desk-gateway';
import { UserIdentitySchema } from '@schema/user-identity';

export class AccountResourceMapper {
  toAccount(item: UserIdentitySchema.User): Required<DeskGatewaySchema.Account> {
    return {
      resource: 'account',
      id: item.id,
      nickname: item.nickname,
      registeredAt: item.registered_at,
      profile: this.toAccountProfile(item.profile),
      verification: this.toAccountVerification(item.verification),
      authData: this.toAccountAuthData(item.auth_data),
    };
  }

  toAccountAuthData(item: UserIdentitySchema.UserAuthData): Required<DeskGatewaySchema.AccountAuthData> {
    return {
      walletAddress: item.address,
    };
  }

  toAccountProfile(item: UserIdentitySchema.UserProfile): Required<DeskGatewaySchema.AccountProfile> {
    return {
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      location: item.location,
      telegram: item.telegram,
    };
  }

  toAccountVerification(item: UserIdentitySchema.UserVerification): Required<DeskGatewaySchema.AccountVerification> {
    return {
      isVerified: item.is_verified,
    };
  }
}
