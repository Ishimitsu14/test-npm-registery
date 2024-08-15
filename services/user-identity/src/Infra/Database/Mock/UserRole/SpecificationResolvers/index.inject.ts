import { ModuleMetadata } from '@nestjs/common';

import { UserRoleByTypeSpecificationResolver } from './UserRoleByTypeSpecificationResolver';
import { UserRoleByUserSpecificationResolver } from './UserRoleByUserSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [UserRoleByTypeSpecificationResolver, UserRoleByUserSpecificationResolver];
