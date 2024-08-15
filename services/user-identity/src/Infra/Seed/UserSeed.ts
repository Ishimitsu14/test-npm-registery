import { NotSpecification, OrSpecification, Query, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { UserIdentitySchema } from '@schema/user-identity';
import { Country, Email, EvmPublicAddress, Telegram } from '@shared/common-internal';
import { SeedUtils } from '@shared/db';

import { UNIT_OF_WORK_INJECT_TOKEN, USER_REPOSITORY_INJECT_TOKEN, USER_ROLE_REPOSITORY_INJECT_TOKEN } from '../../Application';
import { User, UserAuthData, UserByAddressSpecification, UserByNicknameSpecification, UserNickname, UserPK, UserProfile, UserRole, UserRoleType, UserVerification } from '../../Domain';

export class UserSeed {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @InjectContext(USER_REPOSITORY_INJECT_TOKEN)
  private userRepository: InjectContext<USER_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(USER_ROLE_REPOSITORY_INJECT_TOKEN)
  private userRoleRepository: InjectContext<USER_ROLE_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  async createDemo() {
    await this.createUser('0000-ms-capital', '0x6D9799540Fc64B060573fC2aFcB257e85F3937C1', 'MSCapital', { firstName: 'John', lastName: 'Doll', telegram: 'mscapital1000' }, [UserRoleType.ADMIN]);
    await this.createUser('0000-observer', '0xED953fD1a141FC6acBa0b2ed5664aB8160df13AC', 'Mr.Observer', { firstName: 'Edward', lastName: 'Henning', telegram: 'mrobserver999' }, [
      UserRoleType.MODERATOR,
    ]);
    await this.createUser('test', '123', 'MSCapital2', {}, []);

    await this.seedUtils.newRequest('user.list', async () => {
      const userRepository = await this.userRepository();

      const query = Query.create(User)
        .addSpecification(OrSpecification.create(WhereInPKSpecification.create(UserPK.raw('test')), NotSpecification.create(new UserByAddressSpecification(EvmPublicAddress.raw('123')))))
        .addSpecification(new UserByNicknameSpecification(UserNickname.raw('MSCapital')));
      await userRepository.find(query);
    });
  }

  async createUser(id: string, _address: string, _nickname: string, _profile: UserIdentitySchema.UserProfile, roles: UserRoleType[]): Promise<User> {
    return this.seedUtils.newRequest('user.create', async () => {
      const uow = await this.uow();
      const userRepository = await this.userRepository();
      const userRoleRepository = await this.userRoleRepository();

      const userPK = UserPK.raw(id);

      const address = EvmPublicAddress.raw(_address);
      const authData = UserAuthData.create(address);
      const nickname = UserNickname.raw(_nickname);
      const profile = UserProfile.create(_profile.firstName, _profile.lastName, Telegram.raw(_profile.telegram), Email.raw(_profile.email), Country.getById(_profile.location));
      const verification = UserVerification.raw(true);

      const user = User.createNew(userPK, authData, nickname, profile, verification);
      userRepository.add(user);

      await Promise.all(
        roles.map(async (roleType) => {
          const userRolePK = await userRoleRepository.nextPK();
          const role = UserRole.createNew(userRolePK, userPK, roleType);
          userRoleRepository.add(role);
        }),
      );

      await uow.commit();

      return user;
    });
  }
}
