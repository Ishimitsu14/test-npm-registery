import { ModuleMetadata } from '@nestjs/common';

import { UserByAddressSpecificationResolver } from './UserByAddressSpecificationResolver';
import { UserByIsVerifiedSpecificationResolver } from './UserByIsVerifiedSpecificationResolver';
import { UserByNicknameSpecificationResolver } from './UserByNicknameSpecificationResolver';
import { UserByProfileEmailSpecificationResolver } from './UserByProfileEmailSpecificationResolver';
import { UserByProfileTelegramSpecificationResolver } from './UserByProfileTelegramSpecificationResolver';
import { UserByRoleSpecificationResolver } from './UserByRoleSpecificationResolver';
import { UserBySearchSpecificationResolver } from './UserBySearchSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  UserByAddressSpecificationResolver,
  UserByIsVerifiedSpecificationResolver,
  UserByNicknameSpecificationResolver,
  UserByProfileEmailSpecificationResolver,
  UserByProfileTelegramSpecificationResolver,
  UserBySearchSpecificationResolver,
  UserByRoleSpecificationResolver,
];
