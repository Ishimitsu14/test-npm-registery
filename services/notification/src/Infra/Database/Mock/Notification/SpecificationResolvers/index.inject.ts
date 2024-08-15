import { ModuleMetadata } from '@nestjs/common';

import { NotificationByIsReadedSpecificationResolver } from './NotificationByIsReadedSpecificationResolver';
import { NotificationByNotificationRequestSpecificationResolver } from './NotificationByNotificationRequestSpecificationResolver';
import { NotificationByRecipientSpecificationResolver } from './NotificationByRecipientSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  NotificationByIsReadedSpecificationResolver,
  NotificationByNotificationRequestSpecificationResolver,
  NotificationByRecipientSpecificationResolver,
];
