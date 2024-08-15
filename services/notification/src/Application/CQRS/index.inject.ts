import { ModuleMetadata } from '@nestjs/common';

import { NotificationGetById, NotificationList, NotificationMakeRead } from './Notification';
import { NotificationConfigGet, NotificationConfigUpdate } from './NotificationConfig';
import { NotificationRequestCreate } from './NotificationRequest';

export const CQRS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  NotificationRequestCreate,
  NotificationMakeRead,
  NotificationList,
  NotificationGetById,
  NotificationConfigGet,
  NotificationConfigUpdate,
];
