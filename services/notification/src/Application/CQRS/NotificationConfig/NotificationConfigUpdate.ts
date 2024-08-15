import { UseCase } from '@ddd/application';
import { NullableObject } from '@ddd/core';
import { EnumerationID } from '@ddd/domain';
import { InjectContext } from '@packages/nestjs-request-context';
import { NotificationSchema } from '@schema/notification';
import { isRequiredSchema, isStringWithValueSchema, validateRoot } from '@shared/validation';

import { NotificationConfig, NotificationRecipientPK, NotificationType } from '../../../Domain';
import { NOTIFICATION_CONFIG_REPOSITORY, UNIT_OF_WORK_INJECT_TOKEN } from '../../InjectTokens';

export type NotificationConfigUpdateProps = NotificationSchema.RPC.DTO.NotificationConfigUpdate.Payload;
export type NotificationConfigUpdateResult = NotificationSchema.RPC.DTO.NotificationConfigUpdate.Result;

export class NotificationConfigUpdate implements UseCase<NotificationConfigUpdateProps, NotificationConfigUpdateResult> {
  @InjectContext(UNIT_OF_WORK_INJECT_TOKEN)
  private readonly uow: InjectContext<UNIT_OF_WORK_INJECT_TOKEN>;

  @InjectContext(NOTIFICATION_CONFIG_REPOSITORY)
  private notificationConfigRepository: InjectContext<NOTIFICATION_CONFIG_REPOSITORY>;

  async validate(payload: NotificationConfigUpdateProps): Promise<void> {
    validateRoot(payload, {
      recipientId: [isRequiredSchema, isStringWithValueSchema],
      settings: [isRequiredSchema],
    });
  }

  async execute(payload: NotificationConfigUpdateProps) {
    const notificationConfigRepository = await this.notificationConfigRepository();
    const uow = await this.uow();

    const notificationRecipientPK = NotificationRecipientPK.create(payload.recipientId);
    let notificationConfig = await notificationConfigRepository.get(notificationRecipientPK);
    if (NullableObject.isEmpty(notificationConfig)) {
      notificationConfig = NotificationConfig.createDefault(notificationRecipientPK);
      notificationConfigRepository.add(notificationConfig);
    }

    const settings: Map<NotificationType, boolean> = new Map();
    const settingsKeys = Object.keys(payload.settings) as EnumerationID<NotificationType>[];
    const notificationTypes = NotificationType.getByIds(settingsKeys);
    for (const type of notificationTypes) {
      const value = payload.settings[type.id];
      if (typeof value === 'boolean') settings.set(type, value);
    }
    notificationConfig.updateSettings(settings);

    notificationConfigRepository.update(notificationConfig);
    await uow.commit();
  }
}
