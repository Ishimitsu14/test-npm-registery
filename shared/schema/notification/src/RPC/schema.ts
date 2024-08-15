import { NotificationType } from '../Resource';
import * as DTO from './DTO';

export type Schema = {
  notificationRequest: {
    create<Type extends NotificationType>(payload: DTO.NotificationRequestCreate.Payload<Type>): DTO.NotificationRequestCreate.Result;
  };
  notification: {
    getById(payload: DTO.NotificationGetById.Payload): DTO.NotificationGetById.Result;
    list(payload: DTO.NotificationList.Payload): DTO.NotificationList.Result;
    makeRead(payload: DTO.NotificationMakeRead.Payload): DTO.NotificationMakeRead.Result;
  };
  notificationConfig: {
    get(payload: DTO.NotificationConfigGet.Payload): DTO.NotificationConfigGet.Result;
    update(payload: DTO.NotificationConfigUpdate.Payload): DTO.NotificationConfigUpdate.Result;
  };
};
