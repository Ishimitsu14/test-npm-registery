import { ModuleMetadata } from '@nestjs/common';

import { FEEDBACK_COMPONENTS_INJECT_PROVIDERS } from './feedback-components.inject';
import { FILE_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS } from './file-management-components.inject';
import { LOT_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS } from './lot-management-components.inject';
import { NOTE_COMPONENTS_INJECT_PROVIDERS } from './note-components.inject';
import { NOTIFICATION_COMPONENTS_INJECT_PROVIDERS } from './notification-components.inject';
import { USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS } from './user-identity-components.inject';

export const COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...FILE_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS,
  ...LOT_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS,
  ...USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS,
  ...NOTE_COMPONENTS_INJECT_PROVIDERS,
  ...NOTIFICATION_COMPONENTS_INJECT_PROVIDERS,
  ...FEEDBACK_COMPONENTS_INJECT_PROVIDERS,
];
