import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Inject } from '@nestjs/common';

import { DealCreatedEvent } from '../../Domain';
import { NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { DealResourceMapper } from '../ResourceMappers';

@RegisterDomainEventTrigger(DealCreatedEvent)
export class DealCreatedThenSendNotificationTrigger implements IDomainEventTrigger<DealCreatedEvent> {
  @Inject(NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN)
  private notificationRPC: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(DealResourceMapper)
  private dealResourceMapper: DealResourceMapper;

  async execute(event: DealCreatedEvent) {
    const deal = this.dealResourceMapper.toDeal(event.deal);

    const moderators = await this.userIdentityRPC.send('user.list', { filter: { roleType: ['MODERATOR', 'ADMIN'] } });
    const moderatorIds = moderators.items.map((user) => user.id);
    const bidMakerIds = deal.bidMakers.map((bidMaker) => bidMaker.userId);
    const offerMakerIds = deal.offerMakers.map((offerMaker) => offerMaker.userId);

    await this.notificationRPC.send('notificationRequest.create', {
      type: 'DEAL_CREATED',
      recipientType: 'OWNER_ID',
      recipients: [...moderatorIds, ...bidMakerIds, ...offerMakerIds],
      payload: { deal },
    });
  }
}
