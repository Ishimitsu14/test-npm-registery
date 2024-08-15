import { NullableObject } from '@ddd/core';
import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Query, WhereInPKSpecification } from '@ddd/specifications';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';

import { NotificationConfig, NotificationRecipientPK, NotificationRecipientType, NotificationRequest, NotificationRequestCreatedEvent } from '../../Domain';
import { NOTIFICATION_CONFIG_REPOSITORY, NOTIFICATION_REPOSITORY, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(NotificationRequestCreatedEvent)
export class NotificationRequestCreatedThenNotificationCreateTrigger implements IDomainEventTrigger<NotificationRequestCreatedEvent> {
  @InjectContext(NOTIFICATION_REPOSITORY)
  private notificationRepository: InjectContext<NOTIFICATION_REPOSITORY>;

  @InjectContext(NOTIFICATION_CONFIG_REPOSITORY)
  private notificationConfigRepository: InjectContext<NOTIFICATION_CONFIG_REPOSITORY>;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private readonly userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  async execute(event: NotificationRequestCreatedEvent): Promise<void> {
    // Public notifications
    if (event.notificationRequest.recipientType.isEquals(NotificationRecipientType.PUBLIC)) {
      const limit = 5000;
      let total = 0;
      let skip = 0;

      do {
        const userResult = await this.userIdentityRPC.send('user.list', { page: { skip, limit } });
        total = userResult.total;
        skip = skip + limit;

        await this.createNotifications(
          event.notificationRequest,
          userResult.items.map((user) => NotificationRecipientPK.create(user.id)),
        );
      } while (total - skip > 0);
    }
    // Private notifications
    else if (event.notificationRequest.recipientType.isEquals(NotificationRecipientType.OWNER_ID)) {
      await this.createNotifications(event.notificationRequest, event.notificationRequest.recipients);
    }
  }

  private async createNotifications(notificationRequest: NotificationRequest, recipients: NotificationRecipientPK[]) {
    if (recipients.length <= 0) return;

    const notificationRepository = await this.notificationRepository();
    const notificationConfigRepository = await this.notificationConfigRepository();

    const notificationConfigResult = await notificationConfigRepository.find(Query.create(NotificationConfig).addSpecification(WhereInPKSpecification.create(recipients)));
    const notificationConfigs = recipients.map((recipient) =>
      NullableObject(
        notificationConfigResult.items.find((config) => config.primaryKey.isEquals(recipient)),
        NotificationConfig.createDefault(recipient),
      ),
    );

    const notifications = notificationRequest.createNotifications(notificationConfigs);
    notificationRepository.upsertMany(notifications);
  }
}
