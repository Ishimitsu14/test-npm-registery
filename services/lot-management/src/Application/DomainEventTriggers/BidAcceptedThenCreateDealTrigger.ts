import { NullableObject } from '@ddd/core';
import { IDomainEventTrigger, RegisterDomainEventTrigger } from '@ddd/events';
import { InjectContext } from '@packages/nestjs-request-context';
import { BidNotAssociatedWithLotError } from '@schema/common';

import { BidAcceptedEvent, Deal, DealPK } from '../../Domain';
import { DEAL_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../InjectTokens';

@RegisterDomainEventTrigger(BidAcceptedEvent)
export class BidAcceptedThenCreateDealTrigger implements IDomainEventTrigger<BidAcceptedEvent> {
  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async execute(event: BidAcceptedEvent): Promise<void> {
    const dealRepository = await this.dealRepository();
    const lotRepository = await this.lotRepository();

    const lot = await lotRepository.get(event.bid.lotPK);
    if (NullableObject.isEmpty(lot)) throw new BidNotAssociatedWithLotError(event.bid.lotPK.id);

    const dealPK = DealPK.fromBidPK(event.bid.primaryKey);
    const deal = Deal.createNewFromLotAndBid(dealPK, lot, event.bid);

    dealRepository.add(deal);
  }
}
