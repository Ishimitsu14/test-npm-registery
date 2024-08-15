import { NullableObject } from '@ddd/core';
import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';

import { BidAcceptedEvent, BidArchivedEvent, BidMadeActiveEvent, BidRejectedEvent } from '../../Domain';
import { LOT_REPOSITORY_INJECT_TOKEN, NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { BidResourceMapper } from '../ResourceMappers';

@RegisterDomainEventTrigger(BidAcceptedEvent)
@RegisterDomainEventTrigger(BidArchivedEvent)
@RegisterDomainEventTrigger(BidMadeActiveEvent)
@RegisterDomainEventTrigger(BidRejectedEvent)
export class BidStatusChangedThenSendNotificationTrigger implements IDomainEventTrigger<BidAcceptedEvent | BidArchivedEvent | BidMadeActiveEvent | BidRejectedEvent> {
  @Inject(NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN)
  private notificationRPC: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN)
  private userIdentityRPC: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(BidResourceMapper)
  private bidResourceMapper: BidResourceMapper;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async execute(event: BidAcceptedEvent | BidArchivedEvent | BidMadeActiveEvent | BidRejectedEvent) {
    try {
      const lotRepository = await this.lotRepository();

      const bid = this.bidResourceMapper.toBid(event.bid);

      const lot = await lotRepository.get(event.bid.lotPK);

      const moderators = await this.userIdentityRPC.send('user.list', { filter: { roleType: ['MODERATOR', 'ADMIN'] } });
      const recipients = moderators.items.map((user) => user.id);

      if (!NullableObject.isEmpty(lot)) {
        recipients.push(lot.offerMaker.userId);
      }

      recipients.push(bid.bidMakerKey.userId);

      await this.notificationRPC.send('notificationRequest.create', {
        type: 'BID_STATUS_CHANGED',
        recipientType: 'OWNER_ID',
        recipients: recipients,
        payload: { bid },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
