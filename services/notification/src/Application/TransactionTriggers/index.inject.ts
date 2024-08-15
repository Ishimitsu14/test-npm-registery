import { ModuleMetadata } from '@nestjs/common';

import { NotificationRequestCreatedThenNotificationCreateTrigger } from './NotificationRequestCreatedThenNotificationCreateTrigger';

export const TRANSATION_TRIGGERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [NotificationRequestCreatedThenNotificationCreateTrigger];
