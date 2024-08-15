import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { NotificationSchema } from '@schema/notification';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { NotificationConfig, NotificationRecipientPK } from '../../../Domain';
import { NOTIFICATION_CONFIG_REPOSITORY } from '../../InjectTokens';
import { NotificationConfigResourceMapper } from '../../ResourceMappers';

export type NotificationConfigGetProps = NotificationSchema.RPC.DTO.NotificationConfigGet.Payload;
export type NotificationConfigGetResult = NotificationSchema.RPC.DTO.NotificationConfigGet.Result;

export class NotificationConfigGet implements UseCase<NotificationConfigGetProps, NotificationConfigGetResult> {
  @InjectContext(NOTIFICATION_CONFIG_REPOSITORY)
  private notificationConfigRepository: InjectContext<NOTIFICATION_CONFIG_REPOSITORY>;

  @Inject(NotificationConfigResourceMapper)
  private notificationConfigResourceMapper: NotificationConfigResourceMapper;

  async validate(payload: NotificationConfigGetProps): Promise<void> {
    validateRoot(payload, {
      recipientId: [isRequiredSchema, isStringWithValueSchema],
    });
  }

  async execute(payload: NotificationConfigGetProps) {
    const notificationConfigRepository = await this.notificationConfigRepository();

    const notificationRecipientPK = NotificationRecipientPK.create(payload.recipientId);
    let notificationConfig = await notificationConfigRepository.get(notificationRecipientPK);
    if (NullableObject.isEmpty(notificationConfig)) notificationConfig = NotificationConfig.createDefault(notificationRecipientPK);

    return this.notificationConfigResourceMapper.toNotificationConfig(notificationConfig);
  }
}
