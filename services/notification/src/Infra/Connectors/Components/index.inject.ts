import { ModuleMetadata } from '@nestjs/common';

import { USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS } from './user-identity-components.inject';

export const COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [...USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS];
