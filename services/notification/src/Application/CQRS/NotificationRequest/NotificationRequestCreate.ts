import LINQ from '@berish/linq';
import { UseCase } from '@ddd/application';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NotificationSchema } from '@schema/notification';
import { isArraySchema, isBooleanSchema, isRequiredSchema, isStringSchema, minSchema, validateRoot } from '@shared/validation';

import { NotificationRecipientPK, NotificationRecipientType, NotificationRequest, NotificationType } from '../../../Domain';
import { NOTIFICATION_REQUEST_REPOSITORY, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';
import { NotificationResourceMapper } from '../../ResourceMappers';

export type NotificationRequestCreateProps = NotificationSchema.RPC.DTO.NotificationRequestCreate.Payload<NotificationSchema.NotificationType>;
export type NotificationRequestCreateResult = NotificationSchema.RPC.DTO.NotificationRequestCreate.Result;

export class NotificationRequestCreate implements UseCase<NotificationRequestCreateProps, NotificationRequestCreateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(NOTIFICATION_REQUEST_REPOSITORY)
  private notificationRequestRepository: InjectContext<NOTIFICATION_REQUEST_REPOSITORY>;

  @Inject(NotificationResourceMapper)
  private notificationResourceMapper: NotificationResourceMapper;

  async validate(payload: NotificationRequestCreateProps): Promise<void> {
    validateRoot(payload, {
      recipientType: [isRequiredSchema, NotificationRecipientType.validator()],
      recipients: [isRequiredSchema, isArraySchema(isStringSchema, minSchema(0))],
      type: [isRequiredSchema, NotificationType.validator()],
      force: [isBooleanSchema],
      payload: [isRequiredSchema],
    });
  }

  async execute(payload: NotificationRequestCreateProps): Promise<NotificationRequestCreateResult> {
    const uow = await this.uow();
    const notificationRequestRepository = await this.notificationRequestRepository();

    const notificationRequestPK = await notificationRequestRepository.generateNextPK();
    const notificationRecipientType = NotificationRecipientType.getById(payload.recipientType);
    const notificationType = NotificationType.getById(payload.type);
    const distinctRecipients = LINQ.from(payload.recipients).distinct().toArray();
    const notificationRecipients = distinctRecipients.map((recipient) => NotificationRecipientPK.create(recipient));
    const notificationRequest = NotificationRequest.create(notificationRequestPK, notificationType, payload.payload, Boolean(payload.force), notificationRecipientType, notificationRecipients);

    notificationRequestRepository.add(notificationRequest);
    await uow.commit();

    return this.notificationResourceMapper.toNotificationRequestKey(notificationRequest.primaryKey);
  }
}
