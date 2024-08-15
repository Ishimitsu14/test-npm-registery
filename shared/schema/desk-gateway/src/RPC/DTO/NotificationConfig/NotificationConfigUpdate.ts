import { NotificationConfigSettings } from '../../../Resource';

export namespace NotificationConfigUpdate {
  export type Payload = {
    settings: NotificationConfigSettings;
  };

  export type Result = void;
}
