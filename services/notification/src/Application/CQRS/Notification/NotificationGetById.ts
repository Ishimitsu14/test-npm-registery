import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NotificationSchema } from '@schema/notification';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { NOTIFICATION_REPOSITORY } from '../../InjectTokens';
import { NotificationResourceMapper } from '../../ResourceMappers';

export type NotificationGetByIdProps = NotificationSchema.RPC.DTO.NotificationGetById.Payload;
export type NotificationGetByIdResult = NotificationSchema.RPC.DTO.NotificationGetById.Result;

export class NotificationGetById implements UseCase<NotificationGetByIdProps, NotificationGetByIdResult> {
  @Inject(NotificationResourceMapper)
  private notificationResourceMapper: NotificationResourceMapper;

  @InjectContext(NOTIFICATION_REPOSITORY)
  private notificationRepository: InjectContext<NOTIFICATION_REPOSITORY>;

  async validate(payload: NotificationGetByIdProps): Promise<void> {
    validateRoot(payload, {
      notificationId: [isRequiredSchema, isStringWithValueSchema],
      recipientId: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: NotificationGetByIdProps): Promise<NotificationGetByIdResult> {
    // const notificationRepository = await this.notificationRepository();
    // const notificationOwnerInfoRepository = await this.notificationOwnerInfoRepository();

    // const notificationPK = NotificationPK.create(payload.id);

    // const notificationOwnerQuery = Query.create(NotificationOwnerInfo).addSpecification(new NotificationOwnerInfoByNotificationIdSpecification(notificationPK));

    // const notification = await notificationRepository.get(notificationPK);
    // if (NullableObject.isEmpty(notification)) throw new NotificationNotFoundError(payload.id);

    // const notificationOwnerInfo = await notificationOwnerInfoRepository.find(notificationOwnerQuery);
    // if (notificationOwnerInfo.count === 0) throw new NotificationOwnerInfoNotFoundError(payload.id);

    // return this.notificationResourceMapper.toNotificationRequest(notification, notificationOwnerInfo.items[0]);

    return null;
  }
}
