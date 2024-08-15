import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Inject } from '@nestjs/common';

import { LotArchivedEvent, LotCompletedEvent, LotMadeActiveEvent, LotRejectedEvent } from '../../Domain';
import { NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotResourceMapper } from '../ResourceMappers';

@RegisterDomainEventTrigger(LotArchivedEvent)
@RegisterDomainEventTrigger(LotCompletedEvent)
@RegisterDomainEventTrigger(LotRejectedEvent)
@RegisterDomainEventTrigger(LotMadeActiveEvent)
export class LotStatusChangedThenSendNotificationTrigger implements IDomainEventTrigger<LotArchivedEvent | LotCompletedEvent | LotRejectedEvent | LotMadeActiveEvent> {
  @Inject(NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN)
  private notificationRPC: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(LotResourceMapper)
  private lotResourceMapper: LotResourceMapper;

  async execute(event: LotArchivedEvent | LotCompletedEvent | LotRejectedEvent | LotMadeActiveEvent) {
    const lot = this.lotResourceMapper.toLot(event.lot);
    const offerMaker = lot.offerMaker.userId;

    const moderators = await this.userIdentityRPC.send('user.list', { filter: { roleType: ['MODERATOR', 'ADMIN'] } });
    const moderatorIds = moderators.items.map((user) => user.id);

    await this.notificationRPC.send('notificationRequest.create', {
      type: 'LOT_STATUS_CHANGED',
      recipientType: 'OWNER_ID',
      recipients: moderatorIds.concat([offerMaker]),
      payload: { lot },
    });
  }
}
