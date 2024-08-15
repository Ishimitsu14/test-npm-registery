import { CoreSchema } from '@schema/core';

import { UserKey } from '../User';
import { NotificationConfigSettings } from './NotificationConfigSettings';

export interface NotificationConfig extends CoreSchema.Resource<'notification_config', UserKey> {
  settings: NotificationConfigSettings;
}
