import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Inject } from '@nestjs/common';

import { LotCreatedEvent } from '../../Domain';
import { NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotResourceMapper } from '../ResourceMappers';

@RegisterDomainEventTrigger(LotCreatedEvent)
export class LotCreatedThenSendNotificationTrigger implements IDomainEventTrigger<LotCreatedEvent> {
  @Inject(NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN)
  private notificationRPC: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  async execute(event: LotCreatedEvent) {
    const lot = this.lotResourceMapper.toLot(event.lot);

    const moderators = await this.userIdentityRPC.send('user.list', { filter: { roleType: ['MODERATOR', 'ADMIN'] } });
    const moderatorIds = moderators.items.map((user) => user.id);

    await this.notificationRPC.send('notificationRequest.create', {
      type: 'LOT_CREATED',
      recipientType: 'OWNER_ID',
      recipients: moderatorIds,
      payload: { lot },
      force: true,
    });
  }
}
