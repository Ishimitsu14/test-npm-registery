import { ModuleMetadata } from '@nestjs/common';
import { mockInject } from '@shared/db';

import { NOTIFICATION_INJECT_PROVIDERS } from './Notification';
import { NOTIFICATION_CONFIG_INJECT_PROVIDERS } from './NotificationConfig';
import { NOTIFICATION_REQUEST_INJECT_PROVIDERS } from './NotificationRequest';

export const MOCK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mockInject(),
  ...NOTIFICATION_INJECT_PROVIDERS,
  ...NOTIFICATION_CONFIG_INJECT_PROVIDERS,
  ...NOTIFICATION_REQUEST_INJECT_PROVIDERS,
];
