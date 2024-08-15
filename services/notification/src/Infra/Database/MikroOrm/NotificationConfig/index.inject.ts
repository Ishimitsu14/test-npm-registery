import { ModuleMetadata, Scope } from '@nestjs/common';

import { NOTIFICATION_CONFIG_REPOSITORY } from '../../../../Application';
import { NotificationConfigRepository } from './NotificationConfigRepository';

export const NOTIFICATION_CONFIG_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: NotificationConfigRepository,
    useClass: NotificationConfigRepository,
    scope: Scope.REQUEST,
  },
  {
    provide: NOTIFICATION_CONFIG_REPOSITORY,
    useExisting: NotificationConfigRepository,
    scope: Scope.REQUEST,
  },
];
