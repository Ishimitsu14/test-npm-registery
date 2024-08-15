import { ModuleMetadata } from '@nestjs/common';
import { CoreResourceMapper } from '@shared/common-internal';

import { AuthResourceMapper } from './AuthResourceMapper';
import { CommonResourceMapper } from './CommonResourceMapper';
import { UserResourceMapper } from './UserResourceMapper';
import { UserRoleResourceMapper } from './UserRoleResourceMapper';

export const RESOURCE_MAPPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [AuthResourceMapper, CommonResourceMapper, UserResourceMapper, UserRoleResourceMapper, CoreResourceMapper];
