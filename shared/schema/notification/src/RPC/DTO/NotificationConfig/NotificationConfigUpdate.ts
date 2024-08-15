import { NotificationConfigSettings, NotificationRecipientPK } from '../../../Resource';

export namespace NotificationConfigUpdate {
  export type Payload = {
    recipientId: NotificationRecipientPK['id'];
    settings: NotificationConfigSettings;
  };

  export type Result = void;
}
