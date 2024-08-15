import { CoreSchema } from '@schema/core';

import { NotificationConfigSettings } from './NotificationConfigSettings';
import { NotificationRecipientPK } from './NotificationRecipientPK';

export interface NotificationConfig extends CoreSchema.Resource<'notification_config'> {
  recipientKey: NotificationRecipientPK;
  settings: NotificationConfigSettings;
}
