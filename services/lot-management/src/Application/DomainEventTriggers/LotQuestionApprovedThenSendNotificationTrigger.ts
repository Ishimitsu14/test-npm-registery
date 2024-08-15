import { NullableObject } from '@ddd/core';
import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { Inject } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';

import { LotPK } from '../../Domain';
import { LotQuestionApprovedEvent } from '../../Domain/LotQuestion/Events';
import { LOT_REPOSITORY_INJECT_TOKEN, NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN } from '../InjectTokens';
import { LotQuestionResourceMapper } from '../ResourceMappers';

@RegisterDomainEventTrigger(LotQuestionApprovedEvent)
export class LotQuestionApprovedThenSendNotificationTrigger implements IDomainEventTrigger<LotQuestionApprovedEvent> {
  @Inject(NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN)
  private notificationRPC: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN;

  @Inject(LotQuestionResourceMapper)
  private lotQuestionResourceMapper: LotQuestionResourceMapper;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async execute(event: LotQuestionApprovedEvent) {
    const lotQuestion = this.lotQuestionResourceMapper.toLotQuestion(event.lotQuestion);
    const lotRepository = await this.lotRepository();
    const lotPK = new LotPK(lotQuestion.lotKey.id);
    const lot = await lotRepository.get(lotPK);

    if (NullableObject.isEmpty(lot)) {
      return;
    }

    console.log(lotQuestion);

    await this.notificationRPC.send('notificationRequest.create', {
      type: 'LOT_QUESTION_PUBLISHED',
      recipientType: 'OWNER_ID',
      recipients: [lotQuestion.userKey.id],
      payload: { lotQuestion },
    });

    await this.notificationRPC.send('notificationRequest.create', {
      type: 'LOT_QUESTION_RECEIVED',
      recipientType: 'OWNER_ID',
      recipients: [lot.offerMaker.userId],
      payload: { lotQuestion },
    });
  }
}
