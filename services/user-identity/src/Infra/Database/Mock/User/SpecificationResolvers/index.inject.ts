import { ModuleMetadata } from '@nestjs/common';

import { UserByProfileTelegramSpecificationResolver } from './UserByProfileTelegramSpecificationResolver';
import { UserByRoleSpecificationResolver } from './UserByRoleSpecificationResolver';
import { UserBySearchSpecificationResolver } from './UserBySearchSpecificationResolver';
import { UserInNicknameSpecificationResolver } from './UserInNicknameSpecificationResolver';
import { UserInPublicAddressesSpecificationResolver } from './UserInPublicAddressesSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  UserInNicknameSpecificationResolver,
  UserInPublicAddressesSpecificationResolver,
  UserByProfileTelegramSpecificationResolver,
  UserBySearchSpecificationResolver,
  UserByRoleSpecificationResolver,
];
