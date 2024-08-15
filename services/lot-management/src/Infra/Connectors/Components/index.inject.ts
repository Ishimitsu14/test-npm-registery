import { ModuleMetadata } from '@nestjs/common';

import { FILE_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS } from './file-management-components.inject';
import { NOTIFICATION_COMPONENTS_INJECT_PROVIDERS } from './notification-components.inject';
import { USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS } from './user-identity-components.inject';

export const COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...FILE_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS,
  ...NOTIFICATION_COMPONENTS_INJECT_PROVIDERS,
  ...USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS,
];
