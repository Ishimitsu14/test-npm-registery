import { ModuleMetadata } from '@nestjs/common';
import { NotificationConfig } from '@shared/config';
import { mikroOrmInject } from '@shared/db';

import { NOTIFICATION_INJECT_PROVIDERS } from './Notification';
import { NOTIFICATION_CONFIG_INJECT_PROVIDERS } from './NotificationConfig';
import { NOTIFICATION_REQUEST_INJECT_PROVIDERS } from './NotificationRequest';

export const MIKRO_ORM_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mikroOrmInject({
    url: NotificationConfig.database.url,
    synchronize: NotificationConfig.database.useSync,
    imports: import('./snapshots.export'),
    useSSL: NotificationConfig.database.useSSL,
    debug: NotificationConfig.logger.level === 'debug',
  }),
  ...NOTIFICATION_INJECT_PROVIDERS,
  ...NOTIFICATION_CONFIG_INJECT_PROVIDERS,
  ...NOTIFICATION_REQUEST_INJECT_PROVIDERS,
];
